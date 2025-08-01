const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Create the scripts directory if it doesn't exist
if (!fs.existsSync(path.join(__dirname))){
  fs.mkdirSync(path.join(__dirname), { recursive: true });
}

try {
  // Read manifest to get version
  const manifestPath = path.join(__dirname, '..', 'manifest.json');
  const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
  const version = manifest.version;
  
  // Create output directory if it doesn't exist
  const outdir = path.join(__dirname, '..', 'dist');
  if (!fs.existsSync(outdir)) {
    fs.mkdirSync(outdir, { recursive: true });
  }
  
  // Create zip file
  const filename = `reel-audio-blocker-v${version}.zip`;
  const zip = new AdmZip();
  
  // Add files to zip
  const filesToExclude = [
    '.git', 
    'node_modules', 
    'dist', 
    'package', 
    'scripts',
    'package.json',
    'package-lock.json',
    '.gitignore'
  ];
  
  // Get all files in the root directory
  const rootDir = path.join(__dirname, '..');
  const files = fs.readdirSync(rootDir);
  
  // Add each file/directory to the zip
  files.forEach(file => {
    const filePath = path.join(rootDir, file);
    if (!filesToExclude.includes(file)) {
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        zip.addLocalFolder(filePath, file);
      } else {
        zip.addLocalFile(filePath);
      }
    }
  });
  
  // Write the zip file
  zip.writeZip(path.join(outdir, filename));
  
  console.log(`Success! Created ${filename} in the dist directory.`);
  console.log('You can now upload this file to the Chrome Web Store or distribute it for manual installation.');
} catch (e) {
  console.error('Error creating package:', e);
}