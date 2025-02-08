use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/develop/calling-rust/
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn get_file_tree() -> FileTree {
    FileTree {
        name: "root".to_string(),
        is_file: false,
        children: vec![
            FileTree {
                name: "child1".to_string(),
                is_file: false,
                children: vec![],
            },
            FileTree {
                name: "child2".to_string(),
                is_file: false,
                children: vec![FileTree {
                    name: "child3".to_string(),
                    is_file: false,
                    children: vec![
                        FileTree {
                            name: "child4".to_string(),
                            is_file: true,
                            children: vec![],
                        },
                    ],
                }],
            },
        ],
    }
}

#[derive(Serialize)]
struct FileTree {
    name: String,
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
