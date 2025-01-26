import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MonacoDiffEditor from "./Diff";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div className="container">
      <div className={`sidebar ${isCollapsed ? "collapsed" : ""}`}>
        <button className="toggle-button" onClick={() => setIsCollapsed(!isCollapsed)}>
          {isCollapsed ? "Expand" : "Collapse"}
        </button>
        {/* Add your file tree component here */}
        <div>File Tree View</div>
      </div>
      <div className="content">
        <MonacoDiffEditor />
      </div>
    </div>
  );
}

export default App;
