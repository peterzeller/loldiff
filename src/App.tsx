import { useState, useRef, useEffect } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MonacoDiffEditor from "./Diff";
import { FileTreeData, FileTreeView } from "./FileTreeView";

interface InvokeResult<T> {
  response: T | null;
  error: Error | null;
  is_loading: boolean
}

function useInvoke<T>(cmd: string, args?: any, options?: any): InvokeResult<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [is_loading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    invoke<T>(cmd, args, options)
      .then(setResponse)
      .catch(setError)
      .finally(() => setIsLoading(false));
  }, [cmd, args, options]);

  return { response, error, is_loading };
}

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const file_tree = useInvoke("get_file_tree", { });
  const [selectedFile, setSelectedFile] = useState<FileTreeData | null>(null);


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
        <div>{ file_tree.is_loading ? "loading" : file_tree.error ? JSON.stringify(file_tree.error) : <FileTreeView fileTree={file_tree.response as any} onSelect={(ft) => setSelectedFile(ft)}></FileTreeView>}</div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} />
      <div className="content">
        <MonacoDiffEditor />
      </div>
    </div>
  );
}

export default App;