import fs from 'node:fs/promises';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import sharp from 'sharp';

const root = process.cwd();
const staticRoot = path.join(root, 'static');
const outputPath = path.join(root, 'src/lib/generated/images.js');
const supportedExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);

async function imageFiles(directory) {
	const entries = await fs.readdir(directory, { withFileTypes: true });
	const files = [];

	for (const entry of entries) {
		const absolutePath = path.join(directory, entry.name);
		if (entry.isDirectory()) {
			files.push(...(await imageFiles(absolutePath)));
		} else if (entry.isFile() && supportedExtensions.has(path.extname(entry.name).toLowerCase())) {
			files.push(absolutePath);
		}
	}

	return files;
}

let previousImages = {};
try {
	const previousModule = await import(pathToFileURL(outputPath).href);
	previousImages = previousModule.images ?? {};
} catch (error) {
	if (error.code !== 'ERR_MODULE_NOT_FOUND') throw error;
}

const output = {};
const allFiles = (await imageFiles(staticRoot)).sort((a, b) => {
	const left = path.relative(staticRoot, a).split(path.sep).join('/');
	const right = path.relative(staticRoot, b).split(path.sep).join('/');
	return left < right ? -1 : left > right ? 1 : 0;
});

for (const filePath of allFiles) {
	const publicPath = `/${path.relative(staticRoot, filePath).split(path.sep).join('/')}`;
	const buffer = await fs.readFile(filePath);
	const sourceHash = createHash('sha256').update(buffer).digest('hex');
	const metadata = await sharp(buffer).metadata();
	const previous = previousImages[publicPath];
	const unchanged = previous?.sourceHash === sourceHash;
	const migratedSeed = previous?.sourceHash === undefined;
	let lqip = unchanged || migratedSeed ? previous?.lqip : null;

	if (!lqip) {
		const placeholder = await sharp(buffer)
			.resize({ width: 24, withoutEnlargement: true })
			.webp({ quality: 30 })
			.toBuffer();
		lqip = `data:image/webp;base64,${placeholder.toString('base64')}`;
	}

	output[publicPath] = {
		width: metadata.width,
		height: metadata.height,
		aspectRatio: unchanged || migratedSeed ? previous?.aspectRatio ?? `${metadata.width}/${metadata.height}` : `${metadata.width}/${metadata.height}`,
		lqip,
		sourceHash
	};
}

await fs.mkdir(path.dirname(outputPath), { recursive: true });
await fs.writeFile(outputPath, `export const images = ${JSON.stringify(output, null, 4)};\n`, 'utf8');
console.log(`Wrote metadata for ${allFiles.length} images to ${path.relative(root, outputPath)}`);
