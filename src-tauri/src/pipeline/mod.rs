use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Pipeline {
    actions: Vec<Action>,
}

#[derive(Debug, Serialize, Deserialize, PartialEq)]
#[serde(tag = "action", content = "params", rename_all = "camelCase")]
pub enum Action {
    Load { path: String, recursive: bool },
    Filter { extension: String },
    Move { destination: String },
}

#[test]
fn test_deserialize_pipeline() {
    use serde_json::from_str;
    let json_str = r#"
        { 
            "actions": [
                {
                    "action": "load",
                    "params": { "path": "/path/to/file.txt", "recursive": true }
                },
                {
                    "action": "filter",
                    "params": { "extension": ".txt" }
                },
                {
                    "action": "move",
                    "params": { "destination": "/path/to/new/file.txt" }
                }
            ]
        }
    "#;

    let expected_pipeline = Pipeline {
        actions: vec![
            Action::Load {
                path: "/path/to/file.txt".to_string(),
                recursive: true,
            },
            Action::Filter {
                extension: ".txt".to_string(),
            },
            Action::Move {
                destination: "/path/to/new/file.txt".to_string(),
            },
        ],
    };

    // Deserialize the JSON string into a Pipeline struct
    let actual_pipeline: Pipeline = from_str(json_str).unwrap();

    // Check that the deserialized struct matches the expected value
    assert_eq!(actual_pipeline, expected_pipeline);
}
