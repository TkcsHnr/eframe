import { floydSteinbergDither } from '$lib/jimp';
import type { Actions, PageServerLoad } from './$types';

type ImageRecord = { id: number; portrait: boolean };
type Image = { id: number; pngUrl: string; portrait: boolean };
type QueueRecord = { id: number; image_id: number; position: number };
type Queue = {id: number; position: number; image:Image}[];
type UrlObject = { path: string; signedUrl: string };

export const load = (async ({ locals: { supabase } }) => {
	// getting id,portrait from db
	const { data: imageData, error: imageError } = await supabase
		.from('images')
		.select('id, portrait')
		.order('created_at', { ascending: false });
	if (imageError) return { error: imageError };
	if (imageData.length == 0) return { images: [], queue: [] };
	const fileNames = imageData.map((img: ImageRecord) => `${img.id}.png`);

	// creating signed urls (1 hour)
	const { data: urlObjects, error: urlError } = await supabase.storage
		.from('images')
		.createSignedUrls(fileNames, 60 * 60);
	if (urlError) return { error: urlError };

	const signedUrls: { [path: string]: string } = {};
	urlObjects.forEach((urlObj: UrlObject) => {
		signedUrls[urlObj.path] = urlObj.signedUrl;
	});

	// creating image objects
	const images: Image[] = imageData.map((img: ImageRecord) => {
		const pngUrl = signedUrls[`${img.id}.png`];

		return { id: img.id, pngUrl, portrait: img.portrait };
	});

	// getting queue items
	const { data: queueImages, error: queueError } = await supabase
		.from('queue')
		.select('id, image_id, position')
		.order('position');
	if (queueError) return { error: queueError };

	const queue: Queue = queueImages.map((record: QueueRecord) => {
		const image = images.find((img: Image) => img.id == record.image_id);
		return {
			id: record.id,
			position: record.position,
			image
		};
	});

	// getting wakeup time
	const { data: wakeupData, error: wakeupError } = await supabase.from('wakeup').select('wakeup_time').single();
	if (wakeupError) return { error: wakeupError };

	return { images: images || [], queue: queue || [], wakeupTime: wakeupData.wakeup_time };
}) satisfies PageServerLoad;

export const actions = {
	updateTime: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const wakeup_time = formData.get('wakeup_time') as string;

		const { error } = await supabase.from('wakeup').update({ wakeup_time }).gt('id', -1);
		return { error };
	},
	uploadImage: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const file = formData.get('file') as File;
		const portrait: boolean = (formData.get('portrait') as boolean | null) || false;

		const fileBuffer = await file.arrayBuffer();
		const { buffer, byteArray } = await floydSteinbergDither(fileBuffer, portrait);

		// inserting id into table
		const { data: insertData, error: idError } = await supabase
			.from('images')
			.insert({ portrait })
			.select('id')
			.single();
		if (idError) return { error: idError };

		const id = insertData.id;
		// uploading bin file to storage
		const { error: binError } = await supabase.storage
			.from('images')
			.upload(`${id}.bin`, byteArray, { contentType: 'application/octet-stream' });
		if (binError) return { error: binError };

		// uploading png file to storage
		const { error: pngError } = await supabase.storage
			.from('images')
			.upload(`${id}.png`, buffer, { contentType: 'image/png' });
		if (pngError) return { error: pngError };
	},
	deleteImage: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		// removing occurences from queue
		const { error: queueError } = await supabase.from('queue').delete().eq('image_id', id);
		if (queueError) return { error: queueError };

		// normalizing queue positions
		const { error: positionError } = await supabase.rpc('normalizePositions');
		if (positionError) return { error: positionError };

		// removing id from table
		const { error: idError } = await supabase.from('images').delete().eq('id', id);
		if (idError) return { error: idError };

		// deleting files from storage
		const { error: storageError } = await supabase.storage
			.from('images')
			.remove([`${id}.bin`, `${id}.png`]);
		if (storageError) return { error: storageError };
	},
	addToQueueEnd: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('id');

		const { error } = await supabase.rpc('addToQueueEnd', { image_id });

		return { error };
	},
	addToQueueFront: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const image_id = formData.get('id');

		const { error } = await supabase.rpc('addToQueueFront', { image_id });

		return { error };
	},
	deleteFromQueue: async ({ request, locals: { supabase } }) => {
		const formData = await request.formData();
		const id = formData.get('id');

		const { error: deleteError } = await supabase.from('queue').delete().eq('id', id);
		if (deleteError) return { error: deleteError };

		const { error } = await supabase.rpc('normalizePositions');
		return { error };
	},
	clearQueue: async ({ request, locals: { supabase } }) => {
		const { error } = await supabase.from('queue').delete().gt('position', 0);

		return { error };
	}
} satisfies Actions;
