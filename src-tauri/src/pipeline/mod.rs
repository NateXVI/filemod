use crate::actions::{Action, Extras, Files, RunAction};
use anyhow::Result;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Pipeline {
    pub id: String,
    pub actions: Vec<Action>,
}

impl Pipeline {
    pub fn run(&self, extras: Option<Extras>) -> Result<Files> {
        let mut files = Files::new();
        for action in &self.actions {
            files = action.run(files, extras.clone())?;
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
    use crate::actions::load::Load;
    use std::path::PathBuf;
    let pipeline = Pipeline {
        id: "1234".to_string(),
        actions: vec![Action::Load(Load {
            path: "./test-files/load".into(),
            recursive: false,
        })],
    };

    let files = pipeline.run(None).unwrap();

    let expected_files = vec!["./test-files/load/file1.txt", "./test-files/load/file2.txt"]
        .into_iter()
        .map(PathBuf::from)
        .collect::<Files>();

    assert_eq!(files, expected_files);
}

#[test]
fn test_deserialize_pipeline() {
    use crate::actions::load::Load;
    use serde_json::from_str;
    let json_str = r#"
        { 
            "id": "1234",
            "actions": [
                {
                    "action": "load",
                    "params": { "path": "/path/to/file.txt", "recursive": true }
                }
            ]
        }
    "#;

    let expected_pipeline = Pipeline {
        id: "1234".to_string(),
        actions: vec![Action::Load(Load {
            path: "/path/to/file.txt".to_string(),
            recursive: true,
        })],
    };

    // Deserialize the JSON string into a Pipeline struct
    let actual_pipeline: Pipeline = from_str(json_str).unwrap();

    // Check that the deserialized struct matches the expected value
    assert_eq!(actual_pipeline, expected_pipeline);
}
