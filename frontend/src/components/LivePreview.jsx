import React, { useEffect, useRef } from "react";

const LivePreview = ({ code }) => {
  const iframeRef = useRef(null);

  useEffect(() => {
    if (!code || !iframeRef.current) return;

    const { html, css, js } = code;
  console.log(code);
    // Inject CSS and JS into the HTML content if not already embedded
    const finalHtml = html.includes("<style>") || html.includes("style.css")
      ? html
      : html.replace("</head>", `<style>${css}</style></head>`)
            .replace("</body>", `<script>${js}</script></body>`);

    iframeRef.current.srcdoc = finalHtml;
  }, [code]);

  return (
    <div style={{ border: "2px solid #ccc", marginTop: "2rem" }}>
      <iframe
        ref={iframeRef}
        title="Live Code Preview"
        style={{ width: "100%", height: "700px", border: "none" }}
        sandbox="allow-scripts allow-same-origin"
      />
    </div>
  );
};

export default LivePreview;
