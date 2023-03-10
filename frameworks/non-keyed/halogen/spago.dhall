{ name = "js-framework-benchmark-halogen"
, dependencies = [ "aff", "arrays", "effect", "halogen", "maybe", "prelude" ]
, packages = ./packages.dhall
, sources = [ "src/**/*.purs" ]
, backend = "purs-backend-es build"
}
