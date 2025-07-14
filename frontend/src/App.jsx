import React, { useState } from "react";
import axios from "axios";
import LivePreview from "./components/LivePreview";

const App = () => {
  const [project, setProject] = useState(null);
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchCode = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setProject(null); // clear previous output

    try {
      const res = await axios.post("http://localhost:3000/generate", {
        prompt,
        chat_history: [],
      });

      setProject(res.data);
    } catch (error) {
      console.error("Error fetching code:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto space-y-4">
        <h1 className="text-3xl font-bold text-center text-green-700">AI Website Generator</h1>

        <input
          type="text"
          placeholder="Enter a prompt, e.g., 'Create a fitness landing page'"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <button
          onClick={fetchCode}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition"
        >
          Generate Website
        </button>

        {loading && (
          <div className="text-center text-gray-600 font-medium mt-4">Loading...</div>
        )}

        {!loading && project && (
          <>
            <h2 className="text-xl font-semibold text-center mt-8">{project.projectName}</h2>
            <LivePreview code={project} />
          </>
        )}
      </div>
    </div>
  );
};

export default App;
