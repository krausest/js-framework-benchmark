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
      <div>Copy/paste current selection</div>
      <div className="copy-paste-panel__buttons">
        <Button
          onClick={copyStateToClipboard}
          icon={<CopyIcon size={20} />}
          aria-label="Copy selected frameworks and benchmarks"
        />
        <Button
          onClick={handlePasteFromClipboard}
          icon={<ClipboardPasteIcon size={20} />}
          aria-label="Paste selected items (or use ctrl/cmd + v for firefox)"
        />
      </div>
    </div>
  );
};

export default CopyPasteControls;
