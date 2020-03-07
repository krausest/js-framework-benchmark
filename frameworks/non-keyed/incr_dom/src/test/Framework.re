include Rely.Make({
  let config =
    Rely.TestFrameworkConfig.initialize({
      snapshotDir: "./lib/__snapshots__",
      projectDir: "."
    });
});
