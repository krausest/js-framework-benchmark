(defproject js-framework-banchmark-reagent "1.0.0"
  :url "https://day8.github.io/re-frame/"
  :license {:name "Apache-2.0"}
  :description "Re-frame demo"

  :dependencies [[org.clojure/clojure "1.11.3"]
                 [org.clojure/clojurescript "1.11.132"]
                 [re-frame "1.4.3"]
                 [reagent "1.2.0"]
                 [cljsjs/react "18.2.0-1"]
                 [cljsjs/react-dom "18.2.0-1"]
                 [cljsjs/react-dom-server "18.2.0-1"]]

  :plugins [[lein-cljsbuild "1.1.8"]]

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
                :fn-invoke-direct true
                :output-to "dist/main.js"
                :output-dir "out"}}}})
