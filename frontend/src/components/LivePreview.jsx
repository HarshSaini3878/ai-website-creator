"use client"
import { useEffect, useRef, useState } from "react"
import { FiRefreshCw, FiExternalLink, FiDownload } from "react-icons/fi"

const LivePreview = ({ code }) => {
  const iframeRef = useRef(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (code && iframeRef.current) {
      updateIframe(code)
    }
  }, [code])

  const updateIframe = (srcCode) => {
    if (!iframeRef.current || !srcCode) return

    setIsLoading(true)
    setError(null)

    try {
      const { html, css, js } = srcCode

      const finalHtml = html.includes("<style>")
        ? html
        : html.replace("</head>", `<style>${css}</style></head>`).replace("</body>", `<script>${js}</script></body>`)

      iframeRef.current.srcdoc = finalHtml

      // Handle iframe load
      iframeRef.current.onload = () => {
        setIsLoading(false)
      }

      iframeRef.current.onerror = () => {
        setError("Failed to load preview")
        setIsLoading(false)
      }
    } catch (err) {
      setError("Error rendering preview")
      setIsLoading(false)
    }
  }

  const refreshPreview = () => {
    if (code) {
      updateIframe(code)
    }
  }

  const openInNewTab = () => {
    if (iframeRef.current && iframeRef.current.srcdoc) {
      const newWindow = window.open()
      newWindow.document.write(iframeRef.current.srcdoc)
      newWindow.document.close()
    }
  }

  const downloadCode = () => {
    if (!code) return

    const { html, css, js } = code
    const fullHtml = html.includes("<style>")
      ? html
      : html.replace("</head>", `<style>${css}</style></head>`).replace("</body>", `<script>${js}</script></body>`)

    const blob = new Blob([fullHtml], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "generated-website.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div className="h-full bg-white shadow-2xl flex flex-col">
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-slate-800 to-slate-900 flex items-center justify-between px-6 border-b border-slate-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
          </div>
          <h3 className="text-white font-semibold text-lg">Live Preview</h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={refreshPreview}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            title="Refresh Preview"
          >
            <FiRefreshCw size={18} />
          </button>
          <button
            onClick={openInNewTab}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            title="Open in New Tab"
          >
            <FiExternalLink size={18} />
          </button>
          <button
            onClick={downloadCode}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-all duration-200"
            title="Download HTML"
          >
            <FiDownload size={18} />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 bg-slate-100 p-4 relative">
        {isLoading && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
              <p className="text-slate-600 font-medium">Loading preview...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 bg-red-50 flex items-center justify-center z-10">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="text-red-800 font-semibold">Preview Error</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
              <button
                onClick={refreshPreview}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        <div className="h-full bg-white rounded-xl shadow-lg overflow-hidden border border-slate-200">
          <iframe
            ref={iframeRef}
            title="Live Preview"
            className="w-full h-full border-none"
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups"
          />
        </div>
      </div>
    </div>
  )
}

export default LivePreview
