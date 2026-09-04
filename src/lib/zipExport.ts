// Lightweight, zero-dependency browser PKZIP archive generator & Vite project exporter

export interface ExportProjectOptions {
  questionId: string;
  title: string;
  description: string;
  files: Record<string, string>;
}

function createZipArchive(files: Record<string, string | Uint8Array>): Uint8Array {
  const table = new Int32Array(256);
  for (let i = 0; i < 256; i++) {
    let c = i;
    for (let k = 0; k < 8; k++) c = (c & 1) ? (0xedb88320 ^ (c >>> 1)) : (c >>> 1);
    table[i] = c;
  }

  function crc32(buf: Uint8Array): number {
    let c = 0 ^ -1;
    for (let i = 0; i < buf.length; i++) c = (c >>> 8) ^ table[(c ^ buf[i]) & 0xff];
    return (c ^ -1) >>> 0;
  }

  const parts: Uint8Array[] = [];
  const cdEntries: Uint8Array[] = [];
  let offset = 0;
  const encoder = new TextEncoder();

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const contentBytes = typeof content === 'string' ? encoder.encode(content) : content;
    const crc = crc32(contentBytes);
    const size = contentBytes.length;

    // Local file header (30 bytes + name)
    const lh = new Uint8Array(30 + nameBytes.length);
    const dv = new DataView(lh.buffer);
    dv.setUint32(0, 0x04034b50, true);
    dv.setUint16(4, 20, true); // Version needed (2.0)
    dv.setUint16(6, 0, true);  // General purpose bit flag
    dv.setUint16(8, 0, true);  // Compression method (0 = store)
    dv.setUint16(10, 0, true); // Last mod time
    dv.setUint16(12, 0, true); // Last mod date
    dv.setUint32(14, crc, true);
    dv.setUint32(18, size, true); // Compressed size
    dv.setUint32(22, size, true); // Uncompressed size
    dv.setUint16(26, nameBytes.length, true);
    dv.setUint16(28, 0, true); // Extra field length
    lh.set(nameBytes, 30);

    parts.push(lh, contentBytes);

    // Central directory file header (46 bytes + name)
    const cd = new Uint8Array(46 + nameBytes.length);
    const cdv = new DataView(cd.buffer);
    cdv.setUint32(0, 0x02014b50, true);
    cdv.setUint16(4, 20, true); // Version made by
    cdv.setUint16(6, 20, true); // Version needed
    cdv.setUint16(8, 0, true);  // Flags
    cdv.setUint16(10, 0, true); // Compression method
    cdv.setUint16(12, 0, true); // Mod time
    cdv.setUint16(14, 0, true); // Mod date
    cdv.setUint32(16, crc, true);
    cdv.setUint32(20, size, true);
    cdv.setUint32(24, size, true);
    cdv.setUint16(28, nameBytes.length, true);
    cdv.setUint16(30, 0, true); // Extra field len
    cdv.setUint16(32, 0, true); // File comment len
    cdv.setUint16(34, 0, true); // Disk number start
    cdv.setUint16(36, 0, true); // Internal attributes
    cdv.setUint32(38, 0, true); // External attributes
    cdv.setUint32(42, offset, true); // Relative offset of local header
    cd.set(nameBytes, 46);

    cdEntries.push(cd);
    offset += lh.length + contentBytes.length;
  }

  const cdOffset = offset;
  let cdSize = 0;
  for (const cd of cdEntries) {
    parts.push(cd);
    cdSize += cd.length;
  }

  // End of central directory record (22 bytes)
  const eocd = new Uint8Array(22);
  const edv = new DataView(eocd.buffer);
  edv.setUint32(0, 0x06054b50, true);
  edv.setUint16(4, 0, true); // Disk number
  edv.setUint16(6, 0, true); // Start disk
  edv.setUint16(8, cdEntries.length, true); // Disk entries
  edv.setUint16(10, cdEntries.length, true); // Total entries
  edv.setUint32(12, cdSize, true);
  edv.setUint32(16, cdOffset, true);
  edv.setUint16(20, 0, true);
  parts.push(eocd);

  const totalLength = parts.reduce((acc, p) => acc + p.length, 0);
  const result = new Uint8Array(totalLength);
  let pos = 0;
  for (const p of parts) {
    result.set(p, pos);
    pos += p.length;
  }
  return result;
}

export function exportMachineCodingZip({
  questionId,
  title,
  description,
  files,
}: ExportProjectOptions): void {
  const safeId = questionId.toLowerCase();
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const projectFolderName = `frontend-${safeId}-${slug}`;

  // Build standard Vite + React project files
  const packageJson = JSON.stringify(
    {
      name: projectFolderName,
      private: true,
      version: '1.0.0',
      type: 'module',
      scripts: {
        dev: 'vite',
        build: 'tsc && vite build',
        preview: 'vite preview',
      },
      dependencies: {
        react: '^19.0.0',
        'react-dom': '^19.0.0',
      },
      devDependencies: {
        '@types/react': '^19.0.0',
        '@types/react-dom': '^19.0.0',
        '@vitejs/plugin-react': '^4.3.4',
        typescript: '^5.7.0',
        vite: '^6.0.0',
      },
    },
    null,
    2
  );

  const viteConfig = `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
});
`;

  const tsConfig = JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2020',
        useDefineForClassFields: true,
        lib: ['ES2020', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        skipLibCheck: true,
        moduleResolution: 'bundler',
        isolatedModules: true,
        jsx: 'react-jsx',
        strict: true,
        noUnusedLocals: false,
        noUnusedParameters: false,
        noFallthroughCasesInSwitch: true,
      },
      include: ['src'],
    },
    null,
    2
  );

  const indexHtml = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${questionId}: ${title}</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`;

  const mainTsx = `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
`;

  const readme = `# ${questionId}: ${title}

> Machine Coding Challenge Solution from Frontend Interview Masterclass

## Description
${description}

---

## Getting Started

### 1. Install Dependencies
\`\`\`bash
npm install
\`\`\`

### 2. Run Development Server
\`\`\`bash
npm run dev
\`\`\`

### 3. Build for Production
\`\`\`bash
npm run build
\`\`\`
`;

  const archiveFiles: Record<string, string> = {
    'package.json': packageJson,
    'vite.config.ts': viteConfig,
    'tsconfig.json': tsConfig,
    'index.html': indexHtml,
    'README.md': readme,
    'src/main.tsx': mainTsx,
  };

  // Add all workspace files into src/
  for (const [filename, content] of Object.entries(files)) {
    if (filename === 'App.tsx' || filename === 'App.jsx') {
      archiveFiles['src/App.tsx'] = content;
    } else if (filename === 'styles.css') {
      archiveFiles['src/styles.css'] = content;
    } else {
      archiveFiles[`src/${filename}`] = content;
    }
  }

  // If styles.css wasn't explicitly provided, add fallback
  if (!archiveFiles['src/styles.css']) {
    archiveFiles['src/styles.css'] = `/* Component Styles */\nbody { margin: 0; font-family: system-ui, sans-serif; }\n`;
  }

  const zipBytes = createZipArchive(archiveFiles);

  // Trigger browser download
  const blob = new Blob([zipBytes], { type: 'application/zip' });
  const downloadUrl = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = downloadUrl;
  a.download = `${projectFolderName}.zip`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(downloadUrl);
}
