enablePlugins(SbtWeb)

lazy val root = project in file(".")

lazy val js = project

scalaJSProjects += js

pipelineStages in Assets += scalaJSPipeline
