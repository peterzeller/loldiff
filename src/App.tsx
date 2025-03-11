import { useState, useRef, useEffect, useMemo } from "react";
import { invoke } from "@tauri-apps/api/core";
import "./App.css";
import MonacoDiffEditor from "./Diff";
import { FileTreeData, FileTreeView } from "./FileTreeView";

interface InvokeResult<T> {
  response: T | null;
  error: Error | null;
  is_loading: boolean;
  ready: boolean;
}

export function useInvoke<T>(ready: boolean, cmd: string, args?: any, options?: any): InvokeResult<T> {
  const [response, setResponse] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [is_loading, setIsLoading] = useState<boolean>(true);

  const memoArgs = useMemo(() => JSON.stringify(args), [args]);
  const memoOptions = useMemo(() => JSON.stringify(options), [options]);

  useEffect(() => {
    if (ready) {
      console.log("useInvoke", cmd, args, options);
      invoke<T>(cmd, args, options)
        .then(setResponse)
        .catch(setError)
        .finally(() => setIsLoading(false));
    }
  }, [ready, cmd, memoArgs, memoOptions]);

  return { ready, response, error, is_loading };
}

function App() {
  const [sidebarWidth, setSidebarWidth] = useState(250);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const file_tree = useInvoke(true, "get_file_tree", { });
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

  const setSelectedFile2 = (ft: FileTreeData) => {
    console.log("setSelectedFile2", ft);
    setSelectedFile(ft);
  }

  return (
    <div className="container">
      <div
        className="sidebar"
        style={{ width: sidebarWidth }}
        ref={sidebarRef}
      >
        {/* Add your file tree component here */}
        <div>{ file_tree.is_loading ? "loading" : file_tree.error ? JSON.stringify(file_tree.error) : <FileTreeView fileTree={file_tree.response as any} onSelect={(ft) => setSelectedFile2(ft)}></FileTreeView>}</div>
      </div>
      <div className="resizer" onMouseDown={handleMouseDown} />
      <div className="content">
        <MonacoDiffEditor selectedFile={selectedFile} />
      </div>
    </div>
  );
}

export default App;