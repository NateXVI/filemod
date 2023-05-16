use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::fs::read_dir;
use walkdir::WalkDir;

use super::{Extras, Files, RunAction};

#[derive(Debug, Serialize, Deserialize, PartialEq)]
pub struct Load {
    pub path: String,
    pub recursive: bool,
}

impl RunAction for Load {
    fn run(&self, files: Files, _: Option<Extras>) -> Result<Files> {
        let mut files = files;
        match self.recursive {
            true => {
                for entry in WalkDir::new(&self.path) {
                    let entry = entry?;
                    let path = entry.path();
                    if path.is_file() {
                        files.insert(path.to_path_buf());
                    }
                }
                Ok(files)
            }
            false => {
                let entries = read_dir(&self.path)?;
                entries.for_each(|entry| match entry {
                    Ok(entry) => {
                        let path = entry.path();
                        if path.is_file() {
                            files.insert(path);
                        }
                    }
                    _ => {}
                });
                Ok(files)
            }
        }
    }
    fn preview(&self, files: Files) -> Result<Files> {
        return Self::run(&self, files, None);
    }
}

#[cfg(test)]
const TEST_LOAD_PATH: &str = "./test-files/load";

#[test]
fn test_load_not_recursive() {
    use std::{collections::HashSet, path::PathBuf};

    let action = Load {
        path: TEST_LOAD_PATH.to_string(),
        recursive: false,
    };
    let expected_files: Files = vec!["./test-files/load/file1.txt", "./test-files/load/file2.txt"]
        .into_iter()
        .map(|s| s.to_string().replace("\\", "/"))
        .map(|s| PathBuf::from(s))
        .collect();

    let files: Files = action
        .run(HashSet::new(), None)
        .unwrap()
        .into_iter()
        .collect();
    assert_eq!(files, expected_files);
}

#[test]
fn test_load_recursive() {
    use std::{collections::HashSet, path::PathBuf};
    let action = Load {
        path: TEST_LOAD_PATH.to_string(),
        recursive: true,
    };

    let expected_files: Files = vec![
        "./test-files/load/file1.txt",
        "./test-files/load/file2.txt",
        "./test-files/load/subdir/file3.txt",
    ]
    .into_iter()
    .map(|s| s.to_string().replace("\\", "/"))
    .map(|s| PathBuf::from(s))
    .collect();

    let files: Files = action
        .run(HashSet::new(), None)
        .unwrap()
        .into_iter()
        .collect();

    assert_eq!(files, expected_files);
}
