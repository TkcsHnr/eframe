import { floydSteinbergDither } from '$lib/jimp';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals: { supabase } }) => {
	const { data: images } = await supabase
		.from('images')
		.select('id,base64')
		.order('created_at', { ascending: false });

	const { data: current } = await supabase.from('current').select('image_id').single();
	const current_id = current?.image_id;

	return { images: images ?? [], current_id };
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
		const id = formData.get('id');

		const { error } = await supabase.from('images').delete().eq('id', id);

		return { error };
	},
	set_current: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error } = await supabase.from('current').upsert({ id: 1, image_id: id });

		return { error };
	}
} satisfies Actions;
