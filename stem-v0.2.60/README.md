# stemjs-demo
This is a demo project to learn StemJS https:/stemjs.org
`Node` and `npm` need to be installed to be able to build this project.
In order to compile the source, you need to have `Rollup` and `Babel` installed.

## Getting started

#### Linux
Assuming `git` is also already installed.
##### Setup
```bash
cd path/to/workspace
git clone https://github.com/mciucu/stemjs-demo
cd stemjs-demo
npm install -g babel-cli rollup
npm update
```

##### Compile
```bash
cd src
rollup -c
```

##### Run
Simply open index.html in your favorite browser (we recommend Google Chrome for full compatibility).

##### Workflow
We usually work with the excellent JetBrain IDEs (Webstorm and PyCharm),
you just need to change the Javascript language version to JSX to work optimally with them.
You can use vim/emacs/whatever else you like though, don't let us spoil your fun.

The entry point of the project is `src/Main.jsx`. Besides it, currently, there is a subfolder with various widgets.
When you want to check the changes you made, compile, refresh the browser (make sure the JS is not cached) and be amazed!

