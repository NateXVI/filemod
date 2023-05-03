import { invoke } from "@tauri-apps/api";

export type LoadParams = {
  path: string;
  recursive?: boolean;
  files?: string[];
};
export async function load(params: LoadParams) {
  return (await invoke("load", {
    recursive: false,
    ...params,
  })) as string[];
}
