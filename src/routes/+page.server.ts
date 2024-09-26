import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { floydSteinbergDither } from '$lib/jimp';

export const actions = {
	default: async ({ request }) => {
		const data = await request.formData();
		const file = data.get('file') as File | null;
		const portrait: boolean = (data.get('portrait') as boolean | null) || false;

		if (!file) {
			return {
				status: 400,
				body: {
					message: 'No file uploaded'
				}
			};
		}

		const fileBuffer = await file.arrayBuffer();
		const { srcBase64 } = await floydSteinbergDither(fileBuffer, portrait);

		return {
			src: srcBase64
		};
	}
} satisfies Actions;

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
