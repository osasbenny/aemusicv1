import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';

async function generateFavicon() {
  try {
    // Read the logo
    const logoBuffer = readFileSync('./client/public/logo.png');
    
    // Generate 32x32 favicon
    const favicon32 = await sharp(logoBuffer)
      .resize(32, 32, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    
    // Generate 16x16 favicon
    const favicon16 = await sharp(logoBuffer)
      .resize(16, 16, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toBuffer();
    
    // Generate 180x180 Apple touch icon
    const appleTouchIcon = await sharp(logoBuffer)
      .resize(180, 180, { fit: 'contain', background: { r: 11, g: 14, b: 20, alpha: 1 } })
      .png()
      .toBuffer();
    
    // Generate 192x192 Android icon
    const androidIcon192 = await sharp(logoBuffer)
      .resize(192, 192, { fit: 'contain', background: { r: 11, g: 14, b: 20, alpha: 1 } })
      .png()
      .toBuffer();
    
    // Generate 512x512 Android icon
    const androidIcon512 = await sharp(logoBuffer)
      .resize(512, 512, { fit: 'contain', background: { r: 11, g: 14, b: 20, alpha: 1 } })
      .png()
      .toBuffer();
    
    // Save favicons
    writeFileSync('./client/public/favicon-32x32.png', favicon32);
    writeFileSync('./client/public/favicon-16x16.png', favicon16);
    writeFileSync('./client/public/apple-touch-icon.png', appleTouchIcon);
    writeFileSync('./client/public/android-chrome-192x192.png', androidIcon192);
    writeFileSync('./client/public/android-chrome-512x512.png', androidIcon512);
    
    // Create a simple ICO file (using 32x32 as base)
    writeFileSync('./client/public/favicon.ico', favicon32);
    
    console.log('✅ Favicons generated successfully!');
    console.log('   - favicon.ico (32x32)');
    console.log('   - favicon-16x16.png');
    console.log('   - favicon-32x32.png');
    console.log('   - apple-touch-icon.png (180x180)');
    console.log('   - android-chrome-192x192.png');
    console.log('   - android-chrome-512x512.png');
  } catch (error) {
    console.error('❌ Error generating favicons:', error);
    process.exit(1);
  }
}

generateFavicon();
