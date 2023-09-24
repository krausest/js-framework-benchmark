import React from "react";

const CopyIcon = () => {
  return (
    <>
      {/* svg from https://ionic.io/ionicons */}
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
        <rect
          x="128"
          y="128"
          width="336"
          height="336"
          rx="57"
          ry="57"
          fill="none"
          stroke="currentColor"
          strokeLinejoin="round"
          strokeWidth="32"
        />
        <path
          d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="32"
        />
      </svg>
    </>
  );
};

export default CopyIcon;
