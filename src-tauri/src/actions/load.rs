use std::{collections::HashSet, fs::read_dir};

use walkdir::WalkDir;

pub fn load(path: &str, recursive: bool) -> Result<HashSet<String>, Box<dyn std::error::Error>> {
    let mut files = HashSet::new();
    match recursive {
        true => {
            for entry in WalkDir::new(path) {
                let entry = entry?;
                let path = entry.path();
                if path.is_file() {
                    files.insert(path.to_str().unwrap().to_string());
                }
            }
            Ok(files)
        }
        false => {
            let entries = read_dir(path)?;
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

    let files: HashSet<String> = load(TEST_PATH, false)
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

    let files: HashSet<String> = load(TEST_PATH, true)
        .unwrap()
        .into_iter()
        .map(|s| s.replace("\\", "/"))
        .collect();

    assert_eq!(files, expected_files);
}
