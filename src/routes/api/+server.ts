import { floydSteinbergDither } from '$lib/jimp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url }) => {
	const { pixelPairArray } = await floydSteinbergDither(
		'https://upload.wikimedia.org/wikipedia/commons/f/f2/Comic_mural_Le_jeune_Albert%2C_Yves_Chaland%2C_Bruxelles.jpg',
		false
	);

	return new Response(JSON.stringify(pixelPairArray));
};
