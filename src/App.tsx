import { useEffect, useState } from "react";
import { open } from "@tauri-apps/api/dialog";

import { load } from "@/lib/commands";

import { Button } from "./components/ui/button";

function App() {
  const [folder, setFolder] = useState<string | null>(null);
  const [nonRecursiveFiles, setNonRecursiveFiles] = useState<string[]>([]);
  const [recursiveFiles, setRecursiveFiles] = useState<string[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const addError = (error: string) => {
    setErrors((errors) => [...errors, error]);
  };

  useEffect(() => {
    if (folder === null) {
      setNonRecursiveFiles([]);
      setRecursiveFiles([]);
      return;
    }

    load({
      path: folder,
      recursive: false,
    })
      .then(setNonRecursiveFiles)
      .catch(addError);
    load({
      path: folder,
      recursive: true,
    })
      .then(setRecursiveFiles)
      .catch(addError);
  }, [folder]);

  const handleSelectFolder = async () => {
    const selected = await open({
      multiple: false,
      directory: true,
    });
    if (selected === null) return;
    setFolder(selected as string);
  };

  return (
    <div
      className="container flex flex-col gap-5 p-4"
      style={{ fontFamily: "sans-serif" }}
    >
      <Button onClick={handleSelectFolder}>Select folder</Button>
      <p>{folder ?? "No folder selected"}</p>
      <details>
        <summary>Errors</summary>
        <ul>
          {errors.map((error, index) => (
            <li key={index}>{error}</li>
          ))}
        </ul>
      </details>
      {folder !== null && (
        <>
          <h1>Non recursive</h1>
          <ul>
            {nonRecursiveFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
          <h1>Recursive</h1>
          <ul>
            {recursiveFiles.map((file, index) => (
              <li key={index}>{file}</li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default App;
