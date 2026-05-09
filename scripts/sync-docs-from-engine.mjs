// Syncs documentation from engine repository to docs repo
// Usage:
//   node scripts/sync-docs-from-engine.mjs --engine ../PixelRoot32-Game-Engine
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const engineArgIndex = process.argv.indexOf('--engine');
const enginePath = engineArgIndex !== -1 && process.argv[engineArgIndex + 1] ? process.argv[engineArgIndex + 1] : './engine';
const docsSource = path.join(enginePath, 'docs');
const docsTarget = path.join(__dirname, '..');

const sections = ['guide', 'api', 'architecture', 'philosophy', 'migration', 'tools'];
const externalSections = ['examples'];

const excludedFiles = ['README.md', 'CHANGELOG.md', 'LICENSE', 'assets', 'img', 'images', '.vitepress', '.github'];

function syncDocs() {
  console.log(`Syncing docs from ${enginePath}...`);
  
  if (!fs.existsSync(docsSource)) {
    console.error(`Error: Engine docs not found at ${docsSource}`);
    process.exit(1);
  }
  
  for (const section of sections) {
    const srcDir = path.join(docsSource, section);
    const destDir = path.join(docsTarget, section);
    const destLegacy = path.join(docsTarget, '_legacy_vitepress', section);

    if (fs.existsSync(srcDir)) {
      copyDirRecursive(srcDir, destDir, excludedFiles, false);
      console.log(`Synced ${section}/`);
    }

    if (fs.existsSync(destDir)) {
      fs.cpSync(destDir, destLegacy, { recursive: true, force: true });
    }
  }

  for (const section of externalSections) {
    const srcDir = path.join(enginePath, section);
    const destDir = path.join(docsTarget, section);
    const destLegacy = path.join(docsTarget, '_legacy_vitepress', section);

    if (fs.existsSync(srcDir)) {
      syncExamplesFromSubdirs(srcDir, destDir);
      console.log(`Synced ${section}/ from engine root`);
    }

    if (fs.existsSync(destDir)) {
      fs.cpSync(destDir, destLegacy, { recursive: true, force: true });
    }
  }

  addGitHubLinksToExamples();

  console.log('Docs sync complete.');
}

function addGitHubLinksToExamples() {
  const examplesDir = path.join(docsTarget, 'examples');
  
  if (!fs.existsSync(examplesDir)) {
    console.log('Examples directory not found, skipping link addition.');
    return;
  }

  const entries = fs.readdirSync(examplesDir, { withFileTypes: true });
  
  for (const entry of entries) {
    if (!entry.isFile() || !entry.name.endsWith('.md')) {
      continue;
    }
    
    if (entry.name === 'demos.md') {
      continue;
    }

    const exampleNameKebab = path.basename(entry.name, '.md');
    const exampleNameSnake = exampleNameKebab.replace(/-/g, '_');
    const githubLink = `https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/${exampleNameSnake}`;
    const filePath = path.join(examplesDir, entry.name);
    const content = fs.readFileSync(filePath, 'utf8');
    
    if (content.includes(githubLink)) {
      console.log(`Link already present in ${entry.name}, skipping.`);
      continue;
    }

    const linkToAdd = `\n\n---\n\n**Source code:** ${githubLink}\n`;
    fs.appendFileSync(filePath, linkToAdd, 'utf8');
    console.log(`Added GitHub link to ${entry.name}`);
  }
}

function syncExamplesFromSubdirs(srcDir, destDir) {
  if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
  }

  const entries = fs.readdirSync(srcDir, { withFileTypes: true });
  const examples = [];

  for (const entry of entries) {
    if (!entry.isDirectory()) continue;

    const readmePath = path.join(srcDir, entry.name, 'README.md');
    if (fs.existsSync(readmePath)) {
      const destPath = path.join(destDir, `${entry.name}.md`);
      fs.copyFileSync(readmePath, destPath);
      examples.push(entry.name);
      console.log(`  Synced ${entry.name}.md`);
    }
  }

  const demosContent = generateDemosIndex(examples);
  fs.writeFileSync(path.join(destDir, 'demos.md'), demosContent, 'utf8');
  console.log(`  Generated demos.md`);
}

function generateDemosIndex(examples) {
  const template = `# Engine sample projects

# PixelRoot32 — Examples

Self-contained **[PlatformIO](https://platformio.org/)** projects that show how to use the engine on **PC (SDL2)** and **ESP32-class boards**. Each folder has its own \`**platformio.ini**\`, \`**src/**\` entry point, and \`**README.md**\` with build flags, supported environments, and documentation links.

**Typical workflow:** open a project folder in PlatformIO (or run CLI from that folder), pick an environment (\`native\`, \`esp32dev\`, etc.), then:

\`\`\`bash
cd <example-folder>
pio run -e <environment>
\`\`\`

On Windows, \`**native**\` examples may need local **SDL2** include/lib paths in \`platformio.ini\` (see comments in [animated_tilemap](https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/animated_tilemap)).

The engine revision for each example is defined in \`**lib_deps**\` inside that example's \`platformio.ini\` (registry tag vs Git branch).

## Catalogue

`;

  const sorted = examples.sort();
  const listItems = sorted.map(name => {
    const githubLink = `https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Game-Engine/tree/main/examples/${name}`;
    return `- [${name}](./${name}) — [source code](${githubLink})`;
  }).join('\n');
  return template + listItems;
}

function copyDirRecursive(src, dest, excluded, onlyMd = false) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    if (excluded.includes(entry.name)) {
      continue;
    }
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      if (!onlyMd) {
        copyDirRecursive(srcPath, destPath, excluded, onlyMd);
      }
    } else if (!onlyMd || entry.name.endsWith('.md')) {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

syncDocs();