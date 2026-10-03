import { useCallback, useEffect } from "react";
import { useRootStore } from "@/store";
import "./CopyPasteControls.css";
import { CopyIcon, ClipboardPasteIcon } from "lucide-react";
import { Button } from "antd";

const CopyPasteControls = () => {
  console.log("CopyPasteControls");

  const setStateFromClipboard = useRootStore((state) => state.setStateFromClipboard);
  const copyStateToClipboard = useRootStore((state) => state.copyStateToClipboard);

  const handlePasteError = (error: Error) => {
    alert("Sorry - couldn't parse pasted selection");
    console.error("Pasting state failed", error);
  };

  const pasteStateFromText = useCallback(
    (text: string) => {
      try {
        const parsedState = JSON.parse(text);
        setStateFromClipboard(parsedState);
      } catch (error) {
        handlePasteError(error as Error);
      }
    },
    [setStateFromClipboard]
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

  const handlePasteFromClipboard = useCallback(async () => {
    try {
      const text = await navigator.clipboard.readText();
      pasteStateFromText(text);
    } catch (error) {
      handlePasteError(error as Error);
    }
  }, [pasteStateFromText]);

  return (
    <div className="copy-paste-panel">
      <p className="select-toolbar__label">Share selection</p>
      <div className="copy-paste-panel__buttons">
        <Button
          onClick={copyStateToClipboard}
          icon={<CopyIcon size={15} aria-hidden="true" />}
          aria-label="Copy selected frameworks and benchmarks"
        >
          Copy
        </Button>
        <Button
          onClick={handlePasteFromClipboard}
          icon={<ClipboardPasteIcon size={15} aria-hidden="true" />}
          aria-label="Paste selected items (or use ctrl/cmd + v for firefox)"
        >
          Paste
        </Button>
      </div>
    </div>
  );
};

export default CopyPasteControls;
