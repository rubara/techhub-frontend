const fs = require('fs');
const path = require('path');

console.log('🔄 Converting fonts to base64...');

const fonts = [
  { input: 'roboto-regular.ttf', output: 'roboto-regular.ts', name: 'Regular' },
  { input: 'roboto-bold.ttf', output: 'roboto-bold.ts', name: 'Bold' }
];

fonts.forEach(font => {
  const fontPath = path.join(__dirname, '../public/fonts', font.input);
  const outputPath = path.join(__dirname, '../src/fonts', font.output);
  
  try {
    const outputDir = path.dirname(outputPath);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const fontBuffer = fs.readFileSync(fontPath);
    const base64Font = fontBuffer.toString('base64');
    
    const varName = font.output.replace('.ts', '').replace(/-/g, '') + 'Base64';
    const fontModule = `// Auto-generated font file\n// Roboto ${font.name} with Cyrillic support\n\nexport const ${varName} = '${base64Font}';\n`;
    
    fs.writeFileSync(outputPath, fontModule);
    
    console.log(`✅ ${font.name} font converted: ${outputPath}`);
  } catch (error) {
    console.error(`❌ Error converting ${font.name}:`, error.message);
  }
});
