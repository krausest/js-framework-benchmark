let upstream =
  https://github.com/purescript/package-sets/releases/download/psc-0.13.6-20200331/packages.dhall sha256:350af1fdc68c91251138198f03ceedc4f8ed6651ee2af8a2177f87bcd64570d4

let overrides = 
  { halogen =
      upstream.halogen // { version = "v5.0.0-rc.8" }
  }

let additions = {=}

in  upstream // overrides // additions
