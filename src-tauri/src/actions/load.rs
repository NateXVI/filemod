use std::{collections::HashSet, fs::read_dir};
use tauri;
use walkdir::WalkDir;

#[derive(Debug)]
pub enum Error {
    Io(std::io::Error),
    WalkDir(walkdir::Error),
}

impl serde::ser::Serialize for Error {
    fn serialize<S: serde::ser::Serializer>(&self, serializer: S) -> Result<S::Ok, S::Error> {
        // serializer.serialize_str(&self);
        match &self {
            Error::Io(e) => serializer.serialize_str(&e.to_string()),
            Error::WalkDir(e) => serializer.serialize_str(&e.to_string()),
        }
    }
}

#[tauri::command]
pub fn load(
    path: String,
    recursive: bool,
    files: Option<HashSet<String>>,
) -> Result<HashSet<String>, Error> {
    let mut files = files.unwrap_or(HashSet::new());
    match recursive {
        true => {
            for entry in WalkDir::new(path) {
                let entry = entry.map_err(|e| Error::WalkDir(e))?;
                let path = entry.path();
                if path.is_file() {
                    files.insert(path.to_str().unwrap().to_string());
                }
            }
            Ok(files)
        }
        false => {
            let entries = read_dir(path).map_err(|e| Error::Io(e))?;
            entries.for_each(|entry| match entry {
                Ok(entry) => {
                    let path = entry.path();
                    if path.is_file() {
                        files.insert(path.to_str().unwrap().to_string());
                    }
                }
                _ => {}
            });
            Ok(files)
        }
    }
}

#[cfg(test)]
const TEST_PATH: &str = "./test-files/load";

#[test]
fn test_load_not_recursive() {
    let expected_files: HashSet<String> =
        vec!["./test-files/load/file1.txt", "./test-files/load/file2.txt"]
            .into_iter()
            .map(|s| s.to_string().replace("\\", "/"))
            .collect();

    let files: HashSet<String> = load(TEST_PATH.to_string(), false, None)
        .unwrap()
        .into_iter()
        .map(|s| s.replace("\\", "/"))
        .collect();
    assert_eq!(files, expected_files);
}

#[test]
fn test_load_recursive() {
    let expected_files: HashSet<String> = vec![
        "./test-files/load/file1.txt",
        "./test-files/load/file2.txt",
        "./test-files/load/subdir/file3.txt",
    ]
    .into_iter()
    .map(|s| s.to_string().replace("\\", "/"))
    .collect();

    let files: HashSet<String> = load(TEST_PATH.to_string(), true, None)
        .unwrap()
        .into_iter()
        .map(|s| s.replace("\\", "/"))
        .collect();

    assert_eq!(files, expected_files);
}
