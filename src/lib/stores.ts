import { writable } from "svelte/store";

export const deleting = writable<number[]>([]);
export const uploading = writable<string>("");