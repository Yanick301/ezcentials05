
import fs from 'fs';
import path from 'path';

const productsData = fs.readFileSync('src/lib/data.ts', 'utf8');
const existingImages = fs.readFileSync('existing_images.txt', 'utf8').split('\n').map(img => img.split('.')[0]);

// Find matches for images: ['...']
const imageIdRegex = /images: \['([^']+)'\]/g;
let match;
const foundImageIds = [];
while ((match = imageIdRegex.exec(productsData)) !== null) {
    foundImageIds.push(match[1]);
}

console.log(`Total images referenced in data.ts: ${foundImageIds.length}`);

const missingInFs = foundImageIds.filter(id => !existingImages.includes(id));
console.log(`Images referenced in data.ts but MISSING in public/images/products: ${missingInFs.length}`);
if (missingInFs.length > 0) {
    console.log('Sample missing IDs:', missingInFs.slice(0, 10));
}
