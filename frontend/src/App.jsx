"use client"
import { useState, useRef, useEffect, useCallback } from "react"
import axios from "axios"
import LivePreview from "./components/LivePreview"
import CodePlayground from "./components/CodePlayground"

const App = () => {
  const [project, setProject] = useState(null)
  const [prompt, setPrompt] = useState("")
  const [loading, setLoading] = useState(false)
  const [leftPaneWidth, setLeftPaneWidth] = useState(50) // percentage

  const containerRef = useRef(null)
  const leftPaneRef = useRef(null)
  const rightPaneRef = useRef(null)
  const isDraggingRef = useRef(false)
  const animationFrameRef = useRef(null)

  const fetchCode = async () => {
    if (!prompt.trim()) return
    setLoading(true)
    setProject(null)

    try {
      const res = await axios.post("http://localhost:3000/generate", {
        prompt,
        chat_history: [],
      })
      setProject(res.data)
    } catch (error) {
      console.error("Error fetching code:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      fetchCode()
    }
  }

  // Optimized dragging with direct DOM manipulation
  const updatePaneWidths = useCallback((leftWidth) => {
    if (!leftPaneRef.current || !rightPaneRef.current) return

    const rightWidth = 100 - leftWidth
    leftPaneRef.current.style.width = `${leftWidth}%`
    rightPaneRef.current.style.width = `${rightWidth}%`
  }, [])

  const handleMouseMove = useCallback(
    (e) => {
      if (!isDraggingRef.current || !containerRef.current) return

      // Cancel previous animation frame
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }

      // Use requestAnimationFrame for smooth updates
      animationFrameRef.current = requestAnimationFrame(() => {
        const containerRect = containerRef.current.getBoundingClientRect()
        const newLeftWidth = ((e.clientX - containerRect.left) / containerRect.width) * 100

        // Constrain between 20% and 80%
        const constrainedWidth = Math.max(20, Math.min(80, newLeftWidth))

        // Update DOM directly for smooth dragging
        updatePaneWidths(constrainedWidth)
      })
    },
    [updatePaneWidths],
  )

  const handleMouseUp = useCallback(() => {
    if (!isDraggingRef.current) return

    isDraggingRef.current = false

    // Update React state only when dragging ends
    if (leftPaneRef.current) {
      const currentWidth = Number.parseFloat(leftPaneRef.current.style.width)
      setLeftPaneWidth(currentWidth)
    }

    // Clean up
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
    }

    // Remove cursor style
    document.body.style.cursor = ""
    document.body.style.userSelect = ""
  }, [])

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove, { passive: true })
    document.addEventListener("mouseup", handleMouseUp)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [handleMouseMove, handleMouseUp])

  const handleDragStart = (e) => {
    e.preventDefault()
    isDraggingRef.current = true

    // Add cursor style for better UX
    document.body.style.cursor = "ew-resize"
    document.body.style.userSelect = "none"
  }

  return (
    <div
      ref={containerRef}
      className="min-h-screen flex bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative"
    >
      {/* Left Pane (Input) */}
      <div
        ref={leftPaneRef}
        className="flex flex-col transition-none" // Remove transition during drag
        style={{
          width: project ? `${leftPaneWidth}%` : "100%",
          minWidth: project ? "300px" : "auto",
        }}
      >
        <div className="flex-1 p-4 md:p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-8">
            {/* Header */}
            <div className="text-center space-y-6">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl shadow-2xl mb-6">
                <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center">
                  <div className="w-5 h-5 bg-gradient-to-br from-blue-600 to-purple-600 rounded-md"></div>
                </div>
              </div>

              <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent leading-tight">
                AI Website Generator
              </h1>

              <p className="text-slate-600 text-xl max-w-lg mx-auto leading-relaxed">
                Transform your ideas into beautiful, responsive websites with the power of artificial intelligence
              </p>
            </div>

            {/* Input Section */}
            <div className="bg-white/70 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/30 p-8 space-y-6">
              <div className="space-y-3">
                <label className="block text-sm font-semibold text-slate-700 uppercase tracking-wide">
                  Describe Your Website
                </label>
                <p className="text-sm text-slate-500">
                  Be specific about the design, functionality, and content you want
                </p>
              </div>

              <div className="relative">
                <textarea
                  placeholder="e.g., 'Create a modern portfolio website with a hero section, about me, projects gallery, and contact form. Use a clean design with blue accents.'"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && e.ctrlKey && fetchCode()}
                  disabled={loading}
                  rows={4}
                  className="w-full px-6 py-4 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-2xl focus:outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100 transition-all duration-300 text-slate-700 placeholder-slate-400 resize-none"
                />
                <div className="absolute bottom-4 right-4">
                  <div className="flex items-center space-x-2 text-xs text-slate-400">
                    <kbd className="px-2 py-1 bg-slate-200 rounded">Ctrl</kbd>
                    <span>+</span>
                    <kbd className="px-2 py-1 bg-slate-200 rounded">Enter</kbd>
                  </div>
                </div>
              </div>

              <button
                onClick={fetchCode}
                disabled={loading || !prompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white py-5 px-8 rounded-2xl font-semibold text-lg shadow-xl hover:shadow-2xl transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative overflow-hidden group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>

                {loading ? (
                  <div className="flex items-center justify-center space-x-3">
                    <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Generating Your Website...</span>
                  </div>
                ) : (
                  <div className="flex items-center justify-center space-x-3">
                    <span>Generate Website</span>
                    <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  </div>
                )}
              </button>
            </div>

            {/* Action Buttons */}
            {!loading && project && (
              <div className="flex flex-wrap gap-3 justify-center">
                <button
                  onClick={() => {
                    setProject(null)
                    setPrompt("")
                  }}
                  className="bg-slate-200 hover:bg-slate-300 text-slate-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Start Over
                </button>
                <button
                  onClick={() => setPrompt((prev) => prev + " with dark theme and modern animations")}
                  className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Add Dark Theme
                </button>
                <button
                  onClick={() => setPrompt((prev) => prev + " with mobile-first responsive design")}
                  className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:scale-105"
                >
                  Make Responsive
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Drag Handle */}
      {project && (
        <div
          onMouseDown={handleDragStart}
          className="w-2 bg-gradient-to-b from-blue-400 to-purple-500 hover:from-blue-500 hover:to-purple-600 cursor-ew-resize flex items-center justify-center group transition-colors duration-200 relative flex-shrink-0"
        >
          <div className="w-1 h-8 bg-white/50 rounded-full group-hover:bg-white/70 transition-all duration-200"></div>

          {/* Tooltip */}
          <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
            <div className="bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap -translate-x-1/2 -translate-y-8">
              Drag to resize
            </div>
          </div>
        </div>
      )}

      {/* Right Pane (Live Preview) */}
      {project && (
        <div
          ref={rightPaneRef}
          className="flex-1 transition-none" // Remove transition during drag
          style={{
            width: `${100 - leftPaneWidth}%`,
            minWidth: "300px",
          }}
        >
          <CodePlayground code={project} />

        </div>
      )}
    </div>
  )
}

export default App
