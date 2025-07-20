
import { useState } from "react"
import CodeEditor from "./CodeEditor"
import LivePreview from "./LivePreview"

const CodePlayground = ({ code }) => {
  const [activeTab, setActiveTab] = useState("preview") // or 'code'

  return (
    <div className="flex flex-col h-full">
      {/* Toggle Bar */}
      <div className="flex bg-slate-200 text-slate-700 font-medium border-b">
        {["code", "preview"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 transition-all duration-200 ${
              activeTab === tab
                ? "bg-slate-900 text-white"
                : "hover:bg-slate-300"
            }`}
          >
            {tab === "code" ? "Code Editor" : "Live Preview"}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === "code" ? (
          <CodeEditor code={code} />
        ) : (
          <LivePreview code={code} />
        )}
      </div>
    </div>
  )
}

export default CodePlayground
