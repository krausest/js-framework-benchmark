import { describe, expect, test } from "vitest";
import { computeResultsCPU } from "./timeline.js";

describe("duration is computed matching to some hand checked examples", () => {
  test("Use the second commit after the layout event and ignore earlier", async () => {
    let result = await computeResultsCPU("unittests/better-react-v1.1.3-keyed_01_run1k_1.json");
    expect(result.duration).toBe(56.253);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false)
    expect(result.maxDeltaBetweenCommits).toBe(45.638);
    expect(result.numberCommits).toBe(2);
  });
  test("Use the later commit after the function call", async () => {
    let result = await computeResultsCPU("unittests/maquette-v3.3.0-non-keyed_04_select1k_10.json");
    expect(result.duration).toBe(169.713);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false)
    expect(result.maxDeltaBetweenCommits).toBe(63.791);
    expect(result.numberCommits).toBe(2);
  });
  test("Ignore timer with no following commit", async () => {
    let result = await computeResultsCPU("unittests/blazor-wasm-v7.0.1-keyed_01_run1k_11.json");
    expect(result.duration).toBe(120.27);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false)
    expect(result.maxDeltaBetweenCommits).toBe(0);
    expect(result.numberCommits).toBe(1);
  });
  test("Ignore second commit after hit test", async () => {
    let result = await computeResultsCPU("unittests/arrowjs-v1.0.0-alpha.9-keyed_07_create10k_0.json");
    expect(result.duration).toBe(814.889);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false)
    expect(result.maxDeltaBetweenCommits).toBe(1220.241);
    expect(result.numberCommits).toBe(3);
  });
  test("Ignore events from GPU thread", async () => {
    let result = await computeResultsCPU("unittests/cample-v3.1.0-keyed_07_create10k_3.json");
    expect(result.duration).toBe(464.271);
    expect(result.droppedNonMainProcessCommitEvents).toBe(true);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false)
    expect(result.maxDeltaBetweenCommits).toBe(0);
    expect(result.numberCommits).toBe(1);
  });
});
