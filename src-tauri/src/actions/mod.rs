pub mod load;

use anyhow::Result;
use enum_dispatch::enum_dispatch;
use serde::{Deserialize, Serialize};
use std::{collections::HashSet, path::PathBuf};

pub type File = PathBuf;
pub type Files = HashSet<File>;

#[enum_dispatch]
#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "action", content = "params", rename_all = "camelCase")]
pub enum Action {
    Load(load::Load),
}

#[enum_dispatch(Action)]
pub trait RunAction {
    fn run(&self, files: Files, extras: Option<Extras>) -> Result<Files>;
    fn preview(&self, files: Files) -> Result<Files>;
}

// extras are only used for tauri actions
#[derive(Clone)]
pub struct Extras {
    pub id: String,
    pub window: tauri::Window,
}

#[test]
fn test_deserialize_actions() {
    let actions: Vec<Action> = serde_json::from_str(
        r#"
        [
            {
                "action": "load",
                "params": {
                    "path": "./test-files/load",
                    "recursive": false
                }
            }
        ]
        "#,
    )
    .unwrap();
    assert_eq!(
        actions,
        vec![Action::Load(load::Load {
            path: "./test-files/load".into(),
            recursive: false,
        })]
    );
}
