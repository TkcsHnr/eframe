import type { RequestHandler } from '../$types';
import { supabaseClient } from '$lib/supabase';

export const GET: RequestHandler = async () => {
	try {
		const { data: currentData, error: currentError } = await supabaseClient
			.from('current')
			.select('image_id')
			.single();

		if (currentError) {
			throw new Error(currentError.message);
		}

		const imageId = currentData?.image_id;
		const { data: imageData, error: imageError } = await supabaseClient
			.from('images')
			.select('pixelArray')
			.eq('id', imageId)
			.single();

		if (imageError) {
			throw new Error(imageError.message);
		}

		const pixelArray = imageData?.pixelArray;
		return new Response(JSON.stringify(pixelArray));

	} catch (error: any) {
		return new Response(
			JSON.stringify({
				error: error.message
			})
		);
	}
};
