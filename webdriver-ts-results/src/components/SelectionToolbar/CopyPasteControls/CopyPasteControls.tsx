import { useCallback, useEffect, useRef, useState } from "react";
import { useRootStore } from "@/store";
import { CopyIcon, ClipboardPasteIcon } from "lucide-react";

const CopyPasteControls = () => {
  console.log("CopyPasteControls");

  const setStateFromClipboard = useRootStore((state) => state.setStateFromClipboard);
  const copyStateToClipboard = useRootStore((state) => state.copyStateToClipboard);

  const [status, setStatus] = useState("");
  const statusTimeout = useRef<number | undefined>(undefined);

  const showStatus = useCallback((message: string) => {
    setStatus(message);
    window.clearTimeout(statusTimeout.current);
    statusTimeout.current = window.setTimeout(() => setStatus(""), 3000);
  }, []);

  useEffect(() => () => window.clearTimeout(statusTimeout.current), []);

  const handlePasteError = useCallback(
    (error: Error) => {
      showStatus("Couldn't read pasted selection");
      console.error("Pasting state failed", error);
    },
    [showStatus]
  );

  const pasteStateFromText = useCallback(
    (text: string) => {
      try {
        const parsedState = JSON.parse(text);
        setStateFromClipboard(parsedState);
        showStatus("Selection pasted");
      } catch (error) {
        handlePasteError(error as Error);
      }
    },
    [setStateFromClipboard, showStatus, handlePasteError]
  );

  const handleClipboardPaste = useCallback(
    async (event: ClipboardEvent) => {
      event.preventDefault();
      const text = event.clipboardData?.getData("text/plain");
      if (text) {
        pasteStateFromText(text);
      }
    },
    [pasteStateFromText]
  );

  useEffect(() => {
    document.addEventListener("paste", handleClipboardPaste);
    return () => {
      document.removeEventListener("paste", handleClipboardPaste);
    };
  }, [handleClipboardPaste]);

  const handleCopy = () => {
    copyStateToClipboard();
    showStatus("Selection copied");
  };

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      pasteStateFromText(text);
    } catch (error) {
      handlePasteError(error as Error);
    }
  }, [pasteStateFromText, handlePasteError]);

  return (
    <div className="copy-paste">
      <p className="toolbar-label">Share selection</p>
      <div className="copy-paste__buttons">
        <button
          type="button"
          className="btn"
          onClick={handleCopy}
          aria-label="Copy selected frameworks and benchmarks"
        >
          <CopyIcon size={15} aria-hidden="true" />
          Copy
        </button>
        <button
          type="button"
          className="btn"
          onClick={handlePasteFromClipboard}
          aria-label="Paste selected items (or use ctrl/cmd + v for firefox)"
        >
          <ClipboardPasteIcon size={15} aria-hidden="true" />
          Paste
        </button>
        <span className="copy-paste__status" role="status">
          {status}
        </span>
      </div>
    </div>
  );
};

export default CopyPasteControls;
