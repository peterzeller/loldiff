use std::path::Path;

use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_file_tree() -> FileTree {
    let folder_1 = std::path::Path::new("/home/peter/work/loldiff/examples/diff1/a");
    let folder_2 = std::path::Path::new("/home/peter/work/loldiff/examples/diff1/b");
    get_file_tree_from_path(folder_1, folder_2)
}

fn get_file_tree_from_path(left_path: &Path, right_path: &Path) -> FileTree {
    let name = left_path.file_name().unwrap().to_str().unwrap().to_string();
    let is_file = left_path.is_file();
    let mut children = vec![];
    if left_path.is_dir() {
        for entry in std::fs::read_dir(left_path).unwrap() {
            let entry = entry.unwrap();
            let child = get_file_tree_from_path(entry.path().as_path(), right_path.join(entry.file_name()).as_path());
            children.push(child);
        }
    }
    // TODO add missing entries from right_path
    FileTree {
        name,
        left_path: left_path.to_str().unwrap().to_string(),
        right_path: right_path.to_str().unwrap().to_string(),
        is_file,
        children,
    }
}

#[derive(Serialize)]
struct FileTree {
    name: String,
    left_path: String,
    right_path: String,
    is_file: bool,
    children: Vec<FileTree>,
}


#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![greet, get_file_tree])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
