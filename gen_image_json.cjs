
const fs = require('fs');
const path = require('path');

const productImagesDir = 'public/images/products';
const categoryImagesDir = 'public/images';

const getImages = (dir) => {
    try {
        return fs.readdirSync(dir)
            .filter(file => file.endsWith('.jpg') || file.endsWith('.png') || file.endsWith('.jpeg') || file.endsWith('.webp'))
            .map(file => path.parse(file).name);
    } catch (e) {
        return [];
    }
};

const existingProductImages = getImages(productImagesDir);
const existingCategoryImages = getImages(categoryImagesDir);

fs.writeFileSync('src/lib/existing-images.json', JSON.stringify(existingProductImages, null, 2));
fs.writeFileSync('src/lib/existing-category-images.json', JSON.stringify(existingCategoryImages, null, 2));

console.log('JSON files generated successfully.');
