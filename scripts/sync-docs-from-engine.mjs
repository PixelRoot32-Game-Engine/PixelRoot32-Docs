// Syncs documentation into the docs repo from two upstream sources:
//   - prose + generated API docs: the engine repository's `docs/` folder
//   - the examples catalogue: the PixelRoot32-Demo-Projects repository
//
// Usage:
//   node scripts/sync-docs-from-engine.mjs \
//     --engine ../PixelRoot32-Game-Engine \
//     --demos ../PixelRoot32-Demo-Projects
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** Reads `--flag <value>` from argv, falling back to `fallback`. */
function readPathArg(flag, fallback) {
  const index = process.argv.indexOf(flag);
  const value = index !== -1 ? process.argv[index + 1] : undefined;
  return value ? value : fallback;
}

const enginePath = readPathArg('--engine', './engine');
const demosPath = readPathArg('--demos', '../PixelRoot32-Demo-Projects');
const docsSource = path.join(enginePath, 'docs');
const docsTarget = path.join(__dirname, '..');

const sections = ['guide', 'api', 'architecture', 'philosophy', 'migration', 'tools'];

const excludedFiles = ['README.md', 'CHANGELOG.md', 'LICENSE', 'assets', 'img', 'images', '.vitepress', '.github'];

const DEMOS_REPO_URL = 'https://github.com/PixelRoot32-Game-Engine/PixelRoot32-Demo-Projects';
const DEMOS_TREE_URL = `${DEMOS_REPO_URL}/tree/main`;

/**
 * Preferred display order for the demo categories.
 *
 * Ordering hint, not an allowlist: any other top-level directory the demos
 * repository grows is appended after these, so a new category still reaches
 * the docs instead of syncing to disk and silently disappearing.
 */
const CATEGORY_ORDER = [
  'getting_started',
  'graphics',
  'input',
  'audio',
  'gameplay',
  'ui',
  'performance',
  'games',
];

const CATEGORY_LABEL = {
  getting_started: 'Getting Started',
  graphics: 'Graphics',
  input: 'Input',
  audio: 'Audio',
  gameplay: 'Gameplay',
  ui: 'UI',
  performance: 'Performance',
  games: 'Games',
};

/** Acronyms that must not be title-cased into `Ui` / `Sfx` / `Hud`. */
const ACRONYMS = { ui: 'UI', sfx: 'SFX', hud: 'HUD', api: 'API', npc: 'NPC' };

/** `sfx_bank` -> `SFX Bank`; used for catalogue entries and sidebar text. */
function humanize(name) {
  return name
    .split('_')
    .map((word) => ACRONYMS[word] ?? word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

function categoryLabel(category) {
  return CATEGORY_LABEL[category] ?? humanize(category);
}

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

  syncExamples();

  console.log('Docs sync complete.');
}

/**
 * Mirrors the demos repository catalogue into `examples/<category>/<demo>/`.
 *
 * Each demo becomes its own directory holding `index.md` plus the image files
 * its README references. Keeping the page in a directory is what lets the
 * upstream relative paths (`screenshots/screenshot.png`) resolve unchanged:
 * a flat `<demo>.md` would make every demo in a category fight over the same
 * `<category>/screenshots/` folder, and rewriting the markdown instead would
 * drift the moment a README moves an asset.
 */
function syncExamples() {
  const destDir = path.join(docsTarget, 'examples');
  const destLegacy = path.join(docsTarget, '_legacy_vitepress', 'examples');

  if (!fs.existsSync(demosPath)) {
    console.error(`Error: Demo projects not found at ${demosPath}`);
    process.exit(1);
  }

  console.log(`Syncing examples from ${demosPath}...`);

  // Everything under examples/ is generated, so start from a clean slate and
  // a demo renamed or dropped upstream cannot survive as a stale page.
  fs.rmSync(destDir, { recursive: true, force: true });
  fs.mkdirSync(destDir, { recursive: true });

  const catalogue = [];

  for (const category of readCategories(demosPath)) {
    const categorySrc = path.join(demosPath, category);
    const demos = readDemos(categorySrc);

    if (demos.length === 0) continue;

    for (const demo of demos) {
      const demoSrc = path.join(categorySrc, demo);
      const demoDest = path.join(destDir, category, demo);
      const sourceUrl = `${DEMOS_TREE_URL}/${category}/${demo}`;
      const body = fs.readFileSync(path.join(demoSrc, 'README.md'), 'utf8').trimEnd();

      fs.mkdirSync(demoDest, { recursive: true });
      fs.writeFileSync(
        path.join(demoDest, 'index.md'),
        `${body}\n\n---\n\n**Source code:** ${sourceUrl}\n`,
        'utf8',
      );

      const images = copyReferencedImages(body, demoSrc, demoDest);
      console.log(`  Synced ${category}/${demo}/ (${images} image${images === 1 ? '' : 's'})`);
    }

    catalogue.push({ category, demos });
  }

  fs.writeFileSync(path.join(destDir, 'demos.md'), generateDemosIndex(catalogue), 'utf8');
  console.log('  Generated demos.md');

  fs.rmSync(destLegacy, { recursive: true, force: true });
  fs.cpSync(destDir, destLegacy, { recursive: true });
}

/**
 * Copies the local images a README embeds, preserving their relative subpath.
 *
 * Vite resolves markdown image sources at build time and fails the whole build
 * on a missing file, so an uncopied screenshot is a hard error rather than a
 * broken image. Only referenced files are copied — the demo's `src/` and build
 * output stay out of the docs.
 */
function copyReferencedImages(markdown, srcDir, destDir) {
  const embedded = markdown.matchAll(/!\[[^\]]*\]\(\s*([^)\s]+)/g);
  let copied = 0;

  for (const [, rawTarget] of embedded) {
    if (/^(https?:|data:|\/|#)/.test(rawTarget)) continue;

    const relative = rawTarget.replace(/^\.\//, '');
    if (relative.startsWith('../')) continue;

    const from = path.join(srcDir, relative);
    if (!fs.existsSync(from)) continue;

    const to = path.join(destDir, relative);
    fs.mkdirSync(path.dirname(to), { recursive: true });
    fs.copyFileSync(from, to);
    copied += 1;
  }

  return copied;
}

/** Demo categories on disk, known ones in curated order, then the rest. */
function readCategories(root) {
  const onDisk = fs
    .readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
    .map((entry) => entry.name);

  const known = CATEGORY_ORDER.filter((category) => onDisk.includes(category));
  const unlisted = onDisk
    .filter((category) => !CATEGORY_ORDER.includes(category))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));

  return [...known, ...unlisted];
}

/** Subdirectories of a category that carry a `README.md` to publish. */
function readDemos(categoryDir) {
  return fs
    .readdirSync(categoryDir, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .filter((demo) => fs.existsSync(path.join(categoryDir, demo, 'README.md')))
    .sort((a, b) => a.localeCompare(b, undefined, { sensitivity: 'base' }));
}

function generateDemosIndex(catalogue) {
  const total = catalogue.reduce((count, group) => count + group.demos.length, 0);

  const header = `# Demo projects

Self-contained **[PlatformIO](https://platformio.org/)** projects that show how to use the engine on **PC (SDL2)** and **ESP32-class boards**. Each project has its own \`platformio.ini\`, \`src/\` entry point, and \`README.md\` with build flags, supported environments, and documentation links.

They live in their own repository: [PixelRoot32-Demo-Projects](${DEMOS_REPO_URL}).

**Typical workflow:** open a project folder in PlatformIO (or run the CLI from that folder), pick an environment (\`native\`, \`esp32dev\`, etc.), then:

\`\`\`bash
cd <category>/<demo>
pio run -e <environment>
\`\`\`

On Windows, \`native\` builds may need local **SDL2** include/lib paths in \`platformio.ini\` (see the comments in each project).

The engine revision a demo builds against is defined in \`lib_deps\` inside that demo's \`platformio.ini\` (registry tag vs Git branch).

## Catalogue

${total} demos across ${catalogue.length} categories.
`;

  const groups = catalogue.map(({ category, demos }) => {
    const rows = demos
      .map((demo) => {
        const sourceUrl = `${DEMOS_TREE_URL}/${category}/${demo}`;
        // Trailing slash: the demo page is an `index.md` inside that directory.
        return `- [${humanize(demo)}](./${category}/${demo}/) — [source code](${sourceUrl})`;
      })
      .join('\n');
    return `### ${categoryLabel(category)}\n\n${rows}\n`;
  });

  return `${header}\n${groups.join('\n')}`;
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
