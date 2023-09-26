import React, { useState } from "react";

function CopyToClipboardButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  return (
    <button className="CopyText" onClick={handleCopyClick} disabled={copied}>
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

export default CopyToClipboardButton;
