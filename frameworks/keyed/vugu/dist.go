//go:build ignore
// +build ignore

package main

import (
	"flag"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"github.com/vugu/vugu/distutil"
)

func main() {

	clean := flag.Bool("clean", false, "Remove dist dir before starting")
	dist := flag.String("dist", "bundled-dist", "Directory to put distribution files in")
	flag.Parse()

	start := time.Now()

	if *clean {
		os.RemoveAll(*dist)
	}

	os.MkdirAll(*dist, 0755) // create dist dir if not there

	// copy static files
	distutil.MustCopyDirFiltered(".", *dist, nil)

	// find and copy wasm_exec.js
	distutil.MustCopyFile(distutil.MustWasmExecJsPath(), filepath.Join(*dist, "wasm_exec.js"))

	// check for vugugen and go get if not there
	if _, err := exec.LookPath("vugugen"); err != nil {
		fmt.Print(distutil.MustExec("go", "get", "github.com/vugu/vugu/cmd/vugugen"))
	}

	// run go generate
	fmt.Print(distutil.MustExec("go", "generate", "."))

	// run go build for wasm binary
	fmt.Print(distutil.MustEnvExec([]string{"GOOS=js", "GOARCH=wasm"}, "go", "build", "-o", filepath.Join(*dist, "main.wasm"), "."))

	// STATIC INDEX FILE:
	// if you are hosting with a static file server or CDN, you can write out the default index.html from simplehttp
	req, _ := http.NewRequest("GET", "/index.html", nil)
	outf, err := os.OpenFile(filepath.Join(*dist, "index.html"), os.O_CREATE|os.O_TRUNC|os.O_WRONLY, 0644)
	distutil.Must(err)
	defer outf.Close()
	// DefaultPageTemplateSource a useful default HTML template for serving pages.
	var StaticHTMLPageTemplateSource = `<!doctype html>
<html>
<head>
{{if .Title}}
<title>{{.Title}}</title>
{{else}}
<title>Vugu Dev - {{.Request.URL.Path}}</title>
{{end}}
<meta charset="utf-8"/>
{{if .MetaTags}}{{range $k, $v := .MetaTags}}
<meta name="{{$k}}" content="{{$v}}"/>
{{end}}{{end}}
{{if .CSSFiles}}{{range $f := .CSSFiles}}
<link rel="stylesheet" href="{{$f}}" />
{{end}}{{end}}
<script src="https://cdn.jsdelivr.net/npm/text-encoding@0.7.0/lib/encoding.min.js"></script> <!-- MS Edge polyfill -->
<script src="./wasm_exec.js"></script>
</head>
<body>
<div id="vugu_mount_point">
{{if .ServerRenderedOutput}}{{.ServerRenderedOutput}}{{else}}
<img style="position: absolute; top: 50%; left: 50%;" src="https://cdnjs.cloudflare.com/ajax/libs/galleriffic/2.0.1/css/loader.gif">
{{end}}
</div>
<script>
var wasmSupported = (typeof WebAssembly === "object");
if (wasmSupported) {
	if (!WebAssembly.instantiateStreaming) { // polyfill
		WebAssembly.instantiateStreaming = async (resp, importObject) => {
			const source = await (await resp).arrayBuffer();
			return await WebAssembly.instantiate(source, importObject);
		};
	}
	const go = new Go();
	WebAssembly.instantiateStreaming(fetch("./main.wasm"), go.importObject).then((result) => {
		go.run(result.instance);
	});
} else {
	document.getElementById("vugu_mount_point").innerHTML = 'This application requires WebAssembly support.  Please upgrade your browser.';
}
</script>
</body>
</html>
`

	template.Must(template.New("_page_").Parse(StaticHTMLPageTemplateSource)).Execute(outf, map[string]interface{}{"Request": req})

	// BUILD GO SERVER:
	// or if you are deploying a Go server (yay!) you can build that binary here
	// fmt.Print(distutil.MustExec("go", "build", "-o", filepath.Join(*dist, "server"), "."))

	log.Printf("dist.go complete in %v", time.Since(start))
}
