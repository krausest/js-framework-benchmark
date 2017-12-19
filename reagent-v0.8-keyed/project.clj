(defproject js-framework-banchmark-reagent "1.0.0"
  :url "http://github.com/reagent-project/reagent"
  :license {:name "Apache-2.0"}
  :description "Reagent demo"

  :dependencies [[org.clojure/clojure "1.8.0"]
                 [org.clojure/clojurescript "1.9.946"]
                 [reagent "0.8.0-alpha2"]
                 [cljsjs/react "16.2.0-1"]
                 [cljsjs/react-dom "16.2.0-1"]
                 [cljsjs/react-dom-server "16.2.0-1"]]

  :plugins [[lein-cljsbuild "1.1.7"]]

  :source-paths ["src"]

  ;; No profiles and merging - just manual configuration for each build type
  :cljsbuild
  {:builds
   {:client
    {:source-paths ["src"]
     :compiler {:source-map true
                :optimizations :none
                :main "demo.main"
                :output-dir "out/js"
                :output-to "dist/main.js"
                :asset-path "out/js"}}

    :prod
    {:source-paths ["src"]
     :compiler {:main "demo.main"
                :optimizations :advanced
                :elide-asserts true
                :pretty-print false
                :output-to "dist/main.js"
                :output-dir "out"}}}})
