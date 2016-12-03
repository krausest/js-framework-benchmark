enablePlugins(SbtWeb)

lazy val js = project

scalaJSProjects += js

pipelineStages in Assets += scalaJSPipeline
