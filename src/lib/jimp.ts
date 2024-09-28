import { colorDiff, intToRGBA, Jimp, limit255, rgbaToInt, type RGBAColor } from 'jimp';

const w = 600;
const h = 448;

const palette = [
	{ r: 0, g: 0, b: 0, a: 255 }, // black
	{ r: 255, g: 255, b: 255, a: 255 }, // white
	{ r: 0, g: 128, b: 0, a: 255 }, // green
	{ r: 0, g: 0, b: 255, a: 255 }, // blue
	{ r: 255, g: 0, b: 0, a: 255 }, // red
	{ r: 255, g: 255, b: 0, a: 255 }, // yellow
	{ r: 255, g: 170, b: 0, a: 255 } // orange
];

const displayHexMap: { [key: number]: number } = {
	0x000000ff: 0x0, // black
	0xffffffff: 0x1, // white
	0x008000ff: 0x2, // green
	0x0000ffff: 0x3, // blue
	0xff0000ff: 0x4, // red
	0xffff00ff: 0x5, // yellow
	0xffaa00ff: 0x6 // orange
};

function findClosestPaletteColor(color: RGBAColor, palette: RGBAColor[]): RGBAColor {
	let min_dist = colorDiff(color, palette[0]);
	let closest = palette[0];
	for (let i = 1; i < palette.length; i++) {
		let dist = colorDiff(color, palette[i]);
		if (dist < min_dist) {
			min_dist = dist;
			closest = palette[i];
		}
	}
	return closest;
}

function getQuantizationError(oldPixel: RGBAColor, newPixel: RGBAColor) {
	return {
		r: oldPixel.r - newPixel.r,
		g: oldPixel.g - newPixel.g,
		b: oldPixel.b - newPixel.b,
		a: 255
	};
}

function toHex(color: RGBAColor) {
	return rgbaToInt(color.r, color.g, color.b, color.a);
}

function addError(color: RGBAColor, error: RGBAColor, ratio: number): RGBAColor {
	return {
		r: limit255(color.r + error.r * ratio),
		g: limit255(color.g + error.g * ratio),
		b: limit255(color.b + error.b * ratio),
		a: 255
	};
}

export async function floydSteinbergDither(
	url: string | Buffer | ArrayBuffer,
	portrait: boolean = false
) {
	const image = await Jimp.read(url);
	if (portrait) image.rotate(90);
	image.cover({ w, h });

	let prevColor = 0;
	const pixelArray: number[] = [];

	for (let y = 0; y < h; y++) {
		for (let x = 0; x < w; x++) {
			let oldPixel = intToRGBA(image.getPixelColor(x, y));
			let newPixel = findClosestPaletteColor(oldPixel, palette);

			let hex = toHex(newPixel);
			image.setPixelColor(hex, x, y);

			if (x % 2 == 0) prevColor = displayHexMap[hex];
			else pixelArray.push((prevColor << 4) | displayHexMap[hex]);

			let error = getQuantizationError(oldPixel, newPixel);

			if (x + 1 < w) {
				image.setPixelColor(
					toHex(addError(intToRGBA(image.getPixelColor(x + 1, y)), error, 7 / 16)),
					x + 1,
					y
				);
			}
			if (x - 1 >= 0 && y + 1 < h) {
				image.setPixelColor(
					toHex(addError(intToRGBA(image.getPixelColor(x - 1, y + 1)), error, 3 / 16)),
					x - 1,
					y + 1
				);
			}
			if (y + 1 < h) {
				image.setPixelColor(
					toHex(addError(intToRGBA(image.getPixelColor(x, y + 1)), error, 5 / 16)),
					x,
					y + 1
				);
			}
			if (x + 1 < w && y + 1 < h) {
				image.setPixelColor(
					toHex(addError(intToRGBA(image.getPixelColor(x + 1, y + 1)), error, 1 / 16)),
					x + 1,
					y + 1
				);
			}
		}
	}

	if (portrait) image.rotate(-90);
	const srcBase64 = await image.getBase64('image/bmp');

	return { srcBase64, pixelArray };
}