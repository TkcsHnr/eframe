import { floydSteinbergDither } from '$lib/jimp';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async () => {
	const { pixelPairArray } = await floydSteinbergDither("https://picsum.photos/1600/1200", false);

	return new Response(JSON.stringify(pixelPairArray));
};
