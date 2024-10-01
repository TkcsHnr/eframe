import { floydSteinbergDither } from '$lib/jimp';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: images, error: imagesError } = await supabase
		.from('images')
		.select('id,base64,portrait')
		.order('created_at', { ascending: false });
	if (imagesError) return { error: imagesError };

	const { data: queue, error: queueError } = await supabase
		.from('queue')
		.select('id, position, image:images(id, base64, portrait)')
		.order('position');
	if (queueError) return { error: queueError };

	return {
		images: images || [],
		queue: queue || []
	};
};

//TODO: add multiple images
//TODO: auto image orientation mode in jimp convert

export const actions = {
	uploadImage: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const portrait: boolean = (formData.get('portrait') as boolean | null) || false;

		const fileBuffer = await file.arrayBuffer();
		const { base64, pixelArray } = await floydSteinbergDither(fileBuffer, portrait);

		const { error } = await supabase.from('images').insert([{ pixelArray, base64, portrait }]);
		return { error };
	},
	deleteImage: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('image_id');

		const { error: queueError } = await supabase.from('queue').delete().eq('image_id', id);
		if (queueError) return { error: queueError };

		const { error: positionError } = await supabase.rpc('normalizePositions');
		if (positionError) return { error: positionError };

		const { error } = await supabase.from('images').delete().eq('id', id);
		return { error };
	},
	addToQueueEnd: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('image_id');

		const { error } = await supabase.rpc('addToQueueEnd', { image_id });

		return { error };
	},
	addToQueueFront: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('image_id');

		const { error } = await supabase.rpc('addToQueueFront', { image_id });

		return { error };
	},
	deleteFromQueue: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const position = formData.get('position');

		const { error: deleteError } = await supabase.from('queue').delete().eq('position', position);
		if (deleteError) return { error: deleteError };

		const { error } = await supabase.rpc('normalizePositions');
		return { error };
	},
	clearQueue: async ({ request, locals: { supabase } }) => {
		const { error } = await supabase.from('queue').delete().gt('position', 0);

		return { error };
	}
} satisfies Actions;
