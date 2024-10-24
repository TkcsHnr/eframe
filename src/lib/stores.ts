import { writable } from 'svelte/store';

type Image = { id: number; pngUrl: string; portrait: boolean };
type Queue = { id: number; position: number; image: Image }[];

export const uploading = writable<string>('');
export const deleting = writable<number[]>([]);
export const queueDeleting = writable<number[]>([]);

export const images = writable<Image[]>([]);
export const queue = writable<Queue>([]);