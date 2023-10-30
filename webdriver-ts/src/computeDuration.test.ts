import { describe, expect, test } from "vitest";
import { computeResultsCPU } from "./timeline.js";

describe("duration is computed matching to some hand checked examples", () => {
  test("Ignore events from other thread", async () => {
    let result = await computeResultsCPU("unittests/cample-v3.1.0-keyed_07_create10k_3.json");
    expect(result.duration).toBe(464.271);
    expect(result.droppedNonMainProcessCommitEvents).toBe(true);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(0);
    expect(result.numberCommits).toBe(1);
  });
  test("Use the commit event after the layout event", async () => {
    let result = await computeResultsCPU("unittests/better-react-v1.1.3-keyed_01_run1k_1.json");
    expect(result.duration).toBe(56.253);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(45.638);
    expect(result.numberCommits).toBe(2);
  });
  test("Use the commit event after the functioncall event", async () => {
    let result = await computeResultsCPU("unittests/arrowjs-v1.0.0-alpha.9-keyed_04_select1k_2.json");
    expect(result.duration).toBe(79.117);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(60.919);
    expect(result.numberCommits).toBe(2);
  });
  test.only("Use the commit event after the fireAnimationFrame event", async () => {
    let result = await computeResultsCPU("unittests/dojo-v8.0.0-keyed_02_replace1k_0.json");
    expect(result.duration).toBe(67.348);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(2.304);
    expect(result.numberCommits).toBe(2);
  });
  // ## Use the commit after the function call

  test("Ignore timer with no following commit", async () => {
    let result = await computeResultsCPU("unittests/blazor-wasm-v7.0.1-keyed_01_run1k_11.json");
    expect(result.duration).toBe(120.27);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(0);
    expect(result.numberCommits).toBe(1);
  });
  test("Ignore second commit after hit test", async () => {
    let result = await computeResultsCPU("unittests/arrowjs-v1.0.0-alpha.9-keyed_07_create10k_0.json");
    expect(result.duration).toBe(814.889);
    expect(result.droppedNonMainProcessCommitEvents).toBe(false);
    expect(result.droppedNonMainProcessOtherEvents).toBe(false);
    expect(result.maxDeltaBetweenCommits).toBe(1220.241);
    expect(result.numberCommits).toBe(3);
  });
});
