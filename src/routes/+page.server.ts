import type { Actions } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { floydSteinbergDither } from '$lib/jimp';
import { supabaseClient } from '$lib/supabase';

export const actions = {
	convert: async ({ request }) => {
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
		const { srcBase64, pixelArray } = await floydSteinbergDither(fileBuffer, portrait);

		return {
			src: srcBase64,
			pixelArrayString: JSON.stringify(pixelArray)
		};
	},
	upload: async ({ request }) => {
		const formData = await request.formData();
		const pixelArrayString = formData.get('pixelArrayString') as string;
		const pixelArray = JSON.parse(pixelArrayString);
		const base64 = formData.get('base64') as string;
		const portrait: boolean = (formData.get('portrait') as boolean | null) || false;

		const { data, error } = await supabaseClient.from('images').insert([{ pixelArray, base64, portrait }]);

		return {
			data,
			error
		};
	}
} satisfies Actions;

export const load = (async () => {
	return {};
}) satisfies PageServerLoad;
