use std::{fs::File, io::{BufReader, Read}, path::Path};

use serde::Serialize;
use sha2::{Digest, Sha256};

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_file_tree() -> FileTree {
    let folder_1 = std::path::Path::new("/home/peter/work/loldiff/examples/diff1/a");
    let folder_2 = std::path::Path::new("/home/peter/work/loldiff/examples/diff1/b");
    get_file_tree_from_path(folder_1, folder_2).unwrap()
}

#[derive(Debug)]
enum Err {
    Io(std::io::Error),
    InvalidPath,
}

impl From<std::io::Error> for Err {
    fn from(e: std::io::Error) -> Self {
        Err::Io(e)
    }
}

fn get_file_tree_from_path(left_path: &Path, right_path: &Path) -> Result<FileTree,Err> {
    let name = left_path.file_name().ok_or(Err::InvalidPath)?.to_str().ok_or(Err::InvalidPath)?.to_string();
    let is_file = left_path.is_file();
    let mut children = vec![];
    let left_hash = if left_path.is_file() {
        hash_file(left_path)?
    } else {
        [0; 32]
    };
    let right_hash = if right_path.is_file() {
        hash_file(right_path)?
    } else {
        [0; 32]
    };
    if left_path.is_dir() {
        for entry in std::fs::read_dir(left_path).unwrap() {
            let entry = entry?;
            let child = get_file_tree_from_path(entry.path().as_path(), right_path.join(entry.file_name()).as_path())?;
            children.push(child);
        }
    }
    if right_path.is_dir() {
        for entry in std::fs::read_dir(right_path).unwrap() {
            let entry = entry?;
            if children.iter().any(|child| child.name == entry.file_name().to_str().unwrap()) {
                continue;
            }
            let child = get_file_tree_from_path(left_path.join(entry.file_name()).as_path(), entry.path().as_path())?;
            children.push(child);
        }
    }


    let status =
        if left_path.exists() {
            if right_path.exists() {
                if left_hash == right_hash {
                    if children.iter().all(|child| child.status == Status::Same) {
                        Status::Same
                    } else {
                        Status::Different
                    }
                } else {
                    Status::Different
                }
            } else {
                Status::RemovedRight
            }
        } else {
            Status::AddedRight
        };


    // TODO add missing entries from right_path
    Ok(FileTree {
        name,
        left_path: left_path.to_str().unwrap().to_string(),
        right_path: right_path.to_str().unwrap().to_string(),
        status,
        left_hash,
        right_hash,
        is_file,
        children,
    })
}

fn hash_file(path: &Path) -> Result<[u8; 32], std::io::Error> {
    let file = File::open(path)?;
    let mut reader = BufReader::new(file);
    let mut hasher = Sha256::new();
    let mut buffer = [0; 1024];

    loop {
        let n = reader.read(&mut buffer)?;
        if n == 0 {
            break;
        }
        hasher.update(&buffer[..n]);
    }

    let result = hasher.finalize();
    Ok(result.into())
}

#[derive(Serialize)]
struct FileTree {
    name: String,
    left_path: String,
    right_path: String,
    status: Status,
    left_hash: [u8; 32],
    right_hash: [u8; 32],
    is_file: bool,
    children: Vec<FileTree>,
}

#[derive(Serialize, Debug, PartialEq, Eq, Clone, Copy)]
enum Status {
    Same,
    Different,
    AddedRight,
    RemovedRight,
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_file_tree])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
