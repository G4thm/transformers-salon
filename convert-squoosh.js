const { ImagePool } = require('@squoosh/lib');
const fs = require('fs');
const path = require('path');

const imagePool = new ImagePool();

const imagesToConvert = [
  {
    input: 'public/brand/fox-logo.png',
    output: 'public/brand/fox-logo.webp',
  },
  {
    input: 'public/brand/fox-mascot.png',
    output: 'public/brand/fox-mascot.webp',
  }
];

async function convertImages() {
  for (const image of imagesToConvert) {
    const inputPath = path.join(__dirname, image.input);
    const outputPath = path.join(__dirname, image.output);

    try {
      console.log(`Converting ${image.input} to WebP...`);
      
      const imageBuffer = fs.readFileSync(inputPath);
      const rawImage = await imagePool.ingestImage(imageBuffer);
      
      const result = await rawImage.encode({
        webp: {
          quality: 85,
        },
      });
      
      fs.writeFileSync(outputPath, result.binary);
      
      const inputStats = fs.statSync(inputPath);
      const outputStats = fs.statSync(outputPath);
      const reduction = ((inputStats.size - outputStats.size) / inputStats.size * 100).toFixed(2);
      
      console.log(`✓ Converted ${image.input}`);
      console.log(`  Original: ${(inputStats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  WebP: ${(outputStats.size / 1024 / 1024).toFixed(2)} MB`);
      console.log(`  Size reduction: ${reduction}%`);
      console.log('');
    } catch (error) {
      console.error(`✗ Error converting ${image.input}:`, error.message);
    }
  }
  
  await imagePool.close();
}

convertImages();
