# GoUI

The production build assets are tracked and no build is required to run the benchmarks.

If you want to build from source, install `go` and `gouix`:

```
go install github.com/twharmon/gouix@latest
```

Install goui dependency:

```
go get ./src
```

Run the development server:
```
gouix serve
```

Build for production:
```
gouix build
```
