"use client"
const CodeEditor = ({ code }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 h-full bg-gray-50 overflow-auto">
      <textarea
        value={code.html}
        readOnly
        className="p-2 border rounded-md bg-white h-64 md:h-full"
        placeholder="HTML"
      />
      <textarea
        value={code.css}
        readOnly
        className="p-2 border rounded-md bg-white h-64 md:h-full"
        placeholder="CSS"
      />
      <textarea
        value={code.js}
        readOnly
        className="p-2 border rounded-md bg-white h-64 md:h-full"
        placeholder="JavaScript"
      />
    </div>
  )
}

export default CodeEditor
