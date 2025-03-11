import { DiffEditor } from "@monaco-editor/react";
import { FileTreeData } from "./FileTreeView";
import { useInvoke } from "./App";

interface MonacoDiffEditorProps {
    selectedFile: FileTreeData | null;
}

const MonacoDiffEditor: React.FC<MonacoDiffEditorProps>  = ({selectedFile}) => {


    const left = useInvoke(selectedFile != null && selectedFile.status != 'AddedRight', "get_file_content", { path: selectedFile?.left_path });
    const right = useInvoke(selectedFile != null && selectedFile.status != 'RemovedRight', "get_file_content", { path: selectedFile?.right_path });

    if (!selectedFile) {
        return <div>Select a file</div>
    }

    if (left.is_loading || right.is_loading) {
        return <div>{`Loading ${selectedFile.left_path}`}</div>
    }
    if (left.error || right.error) {
        return <div>{`Loading ${selectedFile.left_path}: Error ${JSON.stringify(left.error)} / ${JSON.stringify(right.error)}`}</div>
    }
  return (
      <DiffEditor
        height="100%"
        original={left.ready ? left.response as string : ''}
        modified={right.ready ? right.response as string : ''}
        language="python"
        theme="vs-light" // Change to "light" for a light theme
        options={{
          renderSideBySide: true, // Set to false for inline diff view
        }}
      />
  );
};

export default MonacoDiffEditor;