mod actions;
mod pipeline;
use actions::Files;
use pipeline::Pipeline;
use tauri_plugin_window_state;

// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#[cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_window_state::Builder::default().build())
        .plugin(tauri_plugin_persisted_scope::init())
        .invoke_handler(tauri::generate_handler![execute_pipeline])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

#[tauri::command]
async fn execute_pipeline(
    // app: tauri::AppHandle,
    window: tauri::Window,
    pipeline: Pipeline,
) -> Result<Files, String> {
    let extras = actions::Extras {
        id: pipeline.id.clone(),
        window,
    };
    pipeline.run(Some(extras)).map_err(|e| e.to_string())
}
