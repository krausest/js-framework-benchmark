import scala.sys.process.Process

ThisBuild / version      := "16.0.0"
ThisBuild / scalaVersion := "3.3.1"

lazy val frontend = (project in file("."))
  .enablePlugins(ScalaJSPlugin)
  .settings(
    name                            := "laminar-benchmark-app",
    libraryDependencies            ++= List("com.raquo" %%% "laminar" % "16.0.0"),
    scalaJSLinkerConfig             ~= { _.withModuleKind(ModuleKind.ESModule) },
    scalaJSUseMainModuleInitializer := true,
    watchSources                    := watchSources.value.filterNot(source =>
      source.base.getName.endsWith(".less") || source.base.getName.endsWith(".css")
    ),
  )

val buildFrontend = taskKey[Unit]("Build frontend")

buildFrontend := {
  // Generate Scala.js JS output for production
  (frontend / Compile / fullLinkJS).value
  
  // Install JS dependencies from package-lock.json
  val npmCiExitCode = Process("npm ci", cwd = (frontend / baseDirectory).value).!
  if (npmCiExitCode > 0) {
    throw new IllegalStateException(s"npm ci failed. See above for reason")
  }
  
  // Build the frontend with vite
  val buildExitCode = Process("npm run build", cwd = (frontend / baseDirectory).value).!
  if (buildExitCode > 0) {
    throw new IllegalStateException(s"Building frontend failed. See above for reason")
  }
}