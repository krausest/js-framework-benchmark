import React from "react";
import { useCallback } from "react";
import { useEffect } from "react";
import { useRootStore } from "../../reducer";
import PasteIcon from "../../assets/icons/PasteIcon";
import CopyIcon from "../../assets/icons/CopyIcon";
import "./CopyPasteSelection.css";

const CopyPasteSelection = () => {
  console.log("CopyPasteSelection");

  const state = useRootStore((state) => state);
  const setStateFromClipboard = useRootStore(
    (state) => state.setStateFromClipboard,
  );

  const handlePasteError = (error: Error) => {
    alert("Sorry - couldn't parse pasted selection");
    console.error("Pasting state failed", error);
  };

  const handlePaste = useCallback(
    (text: string) => {
      try {
        const parsedState = JSON.parse(text);
        setStateFromClipboard(parsedState);
      } catch (error) {
        handlePasteError(error as Error);
      }
    },
    [setStateFromClipboard],
  );

  const handleClipboardPaste = useCallback(
    async (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        handlePaste(text);
      }
    },
    [handlePaste],
  );

  useEffect(() => {
    document.addEventListener("paste", handleClipboardPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardPaste);
    };
  }, [handleClipboardPaste]);

  const copy = () => {
    const serializedState = {
      frameworks: state.frameworks
        .filter((f) => state.selectedFrameworks.has(f))
        .map((f) => f.dir),
      benchmarks: state.benchmarks
        .filter((f) => state.selectedBenchmarks.has(f))
        .map((f) => f.id),
      displayMode: state.displayMode,
    };

    const json = JSON.stringify(serializedState);

    try {
      navigator.clipboard.writeText(json);
      window.location.hash = btoa(json);
    } catch (error) {
      console.error("Copying state failed", error);
    }
  };

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      handlePaste(text);
    } catch (error) {
      handlePasteError(error as Error);
    }
  }, [handlePaste]);

  return (
    <>
      <div className="copy-paste-panel">
        <p>Copy/paste current selection</p>
        <div>
          <button
            className="button__icon"
            onClick={copy}
            aria-label="Copy selected frameworks and benchmarks"
          >
            <CopyIcon></CopyIcon>
          </button>
          <button
            className="button__icon"
            onClick={handlePasteFromClipboard}
            aria-label="Paste selected items (or use ctrl/cmd + v for firefox)"
          >
            <PasteIcon></PasteIcon>
          </button>
        </div>
      </div>
    </>
  );
};

export default CopyPasteSelection;
