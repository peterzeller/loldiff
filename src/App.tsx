import { useState, useRef } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MonacoDiffEditor from "./Diff";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef<HTMLDivElement>(null);

  async function greet() {
    setGreetMsg(await invoke("greet", { name }));
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (sidebarRef.current) {
      const newWidth = e.clientX - sidebarRef.current.getBoundingClientRect().left;
      setSidebarWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp);
  };

  return (
    <div className="container">
      <div
        className="sidebar"
        style={{ width: sidebarWidth }}
        ref={sidebarRef}
      >
        {/* Add your file tree component here */}
        <div>File Tree View!!</div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} />
      <div className="content">
        <MonacoDiffEditor />
      </div>
    </div>
  );
}

export default App;