import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';

export interface FileTreeData {
    name: string;
    left_path: string,
    right_path: string,
    is_file: boolean;
    status: Status,
    children: FileTreeData[];
}

type Status = 'Same' | 'Different' | 'AddedRight' | 'RemovedRight';

interface FileTreeNodeProps {
    fileTree: FileTreeData;
    onSelect: (file: FileTreeData) => void;
  }

const FileTreeNode: React.FC<FileTreeNodeProps> = ({ fileTree, onSelect }) => {
    const [expanded, setExpanded] = React.useState(true);

    const statusClassName = `eq-status-${fileTree.status}`;

    if (fileTree.is_file) {
        return <li key={fileTree.name} className={`file-tree-entry ${statusClassName}`}>
            <span onClick={() => onSelect(fileTree)}>
                {/* <FontAwesomeIcon icon={'file'}></FontAwesomeIcon> */}
                📄
                {fileTree.name}
                </span>
        </li>
    }
    return <li key={fileTree.name} className={`file-tree-entry ${statusClassName}`}>
        <span onClick={() => setExpanded(!expanded)} >
            {/* <FontAwesomeIcon icon={expanded ? 'folder' : 'folder-closed'}></FontAwesomeIcon> */}
            {expanded ? '📂 ' : '📁'}
            {fileTree.name}
        </span>
        {expanded &&
        <ul className="file-tree">
            {fileTree.children.map(child => <FileTreeNode fileTree={child} onSelect={onSelect} />)}
        </ul>}
    </li>
}

export const FileTreeView: React.FC<FileTreeNodeProps> = ({ fileTree, onSelect }) => {



    return <div>
        <span>{fileTree.name}</span>
        <ul className="file-tree">
            {fileTree.children.map(child => <FileTreeNode fileTree={child} onSelect={onSelect} />)}
        </ul>
    </div>
}