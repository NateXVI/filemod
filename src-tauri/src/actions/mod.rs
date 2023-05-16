use anyhow::Result;
use enum_dispatch::enum_dispatch;
use serde::Deserialize;
use std::{collections::HashSet, path::PathBuf};

pub mod load;

pub type File = PathBuf;
pub type Files = HashSet<File>;

#[enum_dispatch]
#[derive(Debug, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "camelCase")]
pub enum Action {
    Load(load::Load),
}

#[enum_dispatch(Action)]
pub trait RunAction {
    fn run(&self, files: Files, extras: Option<Extras>) -> Result<Files>;
    fn preview(&self, files: Files) -> Result<Files>;
}

// extras are only used for tauri actions
pub struct Extras {
    window: tauri::Window,
}

pub struct Pipeline {
    pub actions: Vec<Action>,
}

impl Pipeline {
    pub fn run(&self) -> Result<Files> {
        let mut files = Files::new();
        for action in &self.actions {
            files = action.run(files, None)?;
        }
        Ok(files)
    }
    pub fn preview(&self, files: Files) -> Result<Files> {
        let mut files = files;
        for action in &self.actions {
            files = action.preview(files)?;
        }
        Ok(files)
    }
}

#[test]
fn test_pipeline() {
    let pipeline = Pipeline {
        actions: vec![Action::Load(load::Load {
            path: "./test-files/load".into(),
            recursive: false,
        })],
    };

    let files = pipeline.run().unwrap();
    println!("{:?}", files);
    assert_eq!(
        files,
        vec!["./test-files/load/file1.txt", "./test-files/load/file2.txt"]
            .into_iter()
            .map(|f| f.into())
            .collect()
    )
}

#[test]
fn test_deserialize_actions() {
    let actions: Vec<Action> = serde_json::from_str(
        r#"
        [
            {
                "type": "load",
                "path": "./test-files/load",
                "recursive": false
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
