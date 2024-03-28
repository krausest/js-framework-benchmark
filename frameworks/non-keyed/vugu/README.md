#  Vugu

This is a Vugu implementation of the benchmark.


## Running the benchmark

Vugu frameworks has a dependency to golang, hence, a pre-built binary has been provided.

In order to execute the benchmark with the pre-built library:

1. Run `npm start` from the root directory - this should start the Vugu implementation on `http://localhost:8080/frameworks/non-keyed/vugu/bundled-dist/index.html`

2. Execute benchmark via `npm run bench -- --framework non-keyed/vugu`

### Building the app manually

If you wish to build the app manually, you will need golang installed on your machine.

To create an executable run `npm run build-prod-force` from frameworks/non-keyed/vugu.
Then repeat the same steps as for running the benchmark with pre-built binary.


## Development setup
If you want to do some development, one of the ways is to utilize a dev server:

```sh
go install github.com/vugu/vgrun
go work use .
vgrun devserver.go
```

The dev server will make the app available at: http://localhost:8844/

If VSCode is your editor of choice, consider downloading vscode-vugu extension to get proper syntax highlighting.