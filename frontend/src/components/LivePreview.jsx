import React, { useEffect, useRef, useState } from "react";

const LivePreview = ({ code }) => {
  const iframeRef = useRef(null);
  const containerRef = useRef(null);
  const [width, setWidth] = useState("40%"); // default width for tablets and up
  const isDragging = useRef(false);

  // Resize logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current || !containerRef.current) return;

      const screenWidth = window.innerWidth;
      const newWidth = screenWidth - e.clientX;
      const minWidth = screenWidth < 768 ? 0.4 * screenWidth : 0.3 * screenWidth; // 40% tablet, 30% desktop

      if (newWidth >= minWidth) {
        setWidth(`${(newWidth / screenWidth) * 100}%`);
      }
    };

    const stopResize = () => (isDragging.current = false);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResize);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResize);
    };
  }, []);

  // Inject HTML/CSS/JS
  useEffect(() => {
    if (!code || !iframeRef.current) return;

    const { html, css, js } = code;

    const finalHtml = html.includes("<style>")
      ? html
      : html
          .replace("</head>", `<style>${css}</style></head>`)
          .replace("</body>", `<script>${js}</script></body>`);

    iframeRef.current.srcdoc = finalHtml;
  }, [code]);

  return (
    <div
      ref={containerRef}
      className="fixed top-0 right-0 h-full bg-white border-l border-gray-300 shadow-xl z-50"
      style={{ width }}
    >
      {/* Drag handle */}
      <div
        onMouseDown={() => (isDragging.current = true)}
        className="absolute left-0 top-0 h-full w-2 cursor-ew-resize bg-gray-200 hover:bg-gray-400 transition"
      />

      {/* Preview Iframe */}
      <iframe
        ref={iframeRef}
        title="Live Preview"
        className="w-full h-full border-none"
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default LivePreview;
