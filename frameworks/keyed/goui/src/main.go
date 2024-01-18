package main

import (
	"main/src/app"

	"github.com/twharmon/goui"
)

func main() {
	goui.Mount("#root", goui.Component(app.App, nil))
}
