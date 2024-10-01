import { floydSteinbergDither } from '$lib/jimp';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: images, error: images_error } = await supabase
		.from('images')
		.select('id,base64,portrait')
		.order('created_at', { ascending: false });
	if (images_error) return { error: images_error };

	return {
		images: images || []
	};
};


export const actions = {
	upload: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const portrait: boolean = (formData.get('portrait') as boolean | null) || false;

		const fileBuffer = await file.arrayBuffer();
		const { base64, pixelArray } = await floydSteinbergDither(fileBuffer, portrait);

		const { error } = await supabase.from('images').insert([{ pixelArray, base64, portrait }]);
		return { error };
	},
	delete: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('image_id');

		const { error } = await supabase.from('images').delete().eq('id', id);
		return { error };
	},
	queueLast: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('image_id');

		const { data: lastPosition, error: positionError } = await supabase.rpc('getLastPosition');
		if (positionError) return { error: positionError };

		const { error: insertError } = await supabase
			.from('queue')
			.insert({ image_id, position: lastPosition + 1 });
		return { error: insertError };
	},
	queueNext: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('image_id');

		const { error: incrementError } = await supabase.rpc('incrementPositions');
		if (incrementError) return { error: incrementError };

		const { error: insertError } = await supabase.from('queue').insert({ image_id, position: 1 });
		return { error: insertError };
	}
} satisfies Actions;
