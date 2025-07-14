import React, { useState } from "react";
import LivePreview from "./components/LivePreview";

const App = () => {
  const [project, setProject] = useState(null);

  const fetchCode = async () => {
    const res = await fetch("http://localhost:3000/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        prompt: "Create a fitness landing page",
        chat_history: [],
      }),
    });

    const data = await res.json();
    setProject(data); // contains { html, css, js, projectName }
  };

  return (
    <div>
      <button onClick={fetchCode}>Generate Website</button>

      {project && (
        <>
          <h2 style={{ marginTop: "2rem" }}>{project.projectName}</h2>
          <LivePreview code={project} />
        </>
      )}
    </div>
  );
};

export default App;
