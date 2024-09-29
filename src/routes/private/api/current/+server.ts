import type { RequestHandler } from './$types';

export const POST: RequestHandler = async ({ request, locals: { supabase } }) => {
	const { email, password } = await request.json();

	const { error } = await supabase.auth.signInWithPassword({ email, password });
	if (error) {
		return new Response(error.message);
	}

	try {
		const { data: currentData, error: currentError } = await supabase
			.from('current')
			.select('image_id')
			.eq('id', 1)
			.single();

		if (currentError) {
			throw new Error(currentError.message);
		}

		const imageId = currentData?.image_id;
		const { data: imageData, error: imageError } = await supabase
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
		return new Response(error.message);
	}
};
