mod actions;
mod pipeline;
use tauri_plugin_window_state;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![actions::load::load])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
