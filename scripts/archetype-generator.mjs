import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to escape backticks and templates
function esc(str) {
  return str.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\${/g, '\\${');
}

// -------------------------------------------------------------
// ARCHETYPE GENERATORS
// -------------------------------------------------------------

export function generateArchetypeCode(title, id, category, difficulty) {
  const t = title.toLowerCase();

  // 1. Tree View / Nested File Explorer / Hierarchy (check before file upload!)
  if (t.includes('tree') || t.includes('file explorer') || t.includes('folder') || t.includes('nested')) {
    const starter = `import React, { useState } from 'react';

const INITIAL_TREE = {
  id: 'root',
  name: 'src',
  type: 'folder',
  children: [
    {
      id: 'comp',
      name: 'components',
      type: 'folder',
      children: [
        { id: '1', name: 'Header.tsx', type: 'file' },
        { id: '2', name: 'Sidebar.tsx', type: 'file' }
      ]
    },
    { id: '3', name: 'App.tsx', type: 'file' },
    { id: '4', name: 'main.css', type: 'file' }
  ]
};

export default function App() {
  const [tree, setTree] = useState(INITIAL_TREE);
  const [expanded, setExpanded] = useState({ root: true, comp: true });

  // TODO 1: Implement recursive TreeNode component
  // TODO 2: Support folder expand/collapse toggle
  // TODO 3: Distinguish between folder and file icons
  // TODO 4: Add file or delete node actions

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>
      <div style={{ background: 'var(--bg, #0f172a)', padding: '16px', borderRadius: '10px' }}>
        {/* Render tree here */}
        <div>📁 {tree.name}</div>
      </div>
    </div>
  );
};`;

    const solution = `import React, { useState } from 'react';

const INITIAL_TREE = {
  id: 'root',
  name: 'project-root',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            { id: 'nav', name: 'Navbar.tsx', type: 'file' },
            { id: 'btn', name: 'Button.tsx', type: 'file' }
          ]
        },
        { id: 'hooks', name: 'useDebounce.ts', type: 'file' },
        { id: 'app', name: 'App.tsx', type: 'file' },
        { id: 'css', name: 'index.css', type: 'file' }
      ]
    },
    { id: 'pkg', name: 'package.json', type: 'file' },
    { id: 'readme', name: 'README.md', type: 'file' }
  ]
};

function TreeNode({ node, level = 0, expanded, onToggle, onSelect, activeId }) {
  const isFolder = node.type === 'folder';
  const isExpanded = !!expanded[node.id];
  const isSelected = activeId === node.id;

  return (
    <div>
      <div
        onClick={() => {
          if (isFolder) onToggle(node.id);
          onSelect(node);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 8px',
          paddingLeft: \`\${level * 16 + 8}px\`,
          borderRadius: '6px',
          cursor: 'pointer',
          background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
          color: isSelected ? '#38bdf8' : 'var(--text-primary, #f8fafc)',
          fontSize: '13px',
          userSelect: 'none'
        }}
      >
        {isFolder ? (
          <span style={{ fontSize: '10px', width: '12px', display: 'inline-block', color: '#94a3b8' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span style={{ width: '12px' }} />
        )}
        <span>{isFolder ? (isExpanded ? '📂' : '📁') : '📄'}</span>
        <span style={{ fontWeight: isFolder ? '600' : '400' }}>{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tree, setTree] = useState(INITIAL_TREE);
  const [expanded, setExpanded] = useState({ root: true, src: true, components: false });
  const [selectedNode, setSelectedNode] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
          {selectedNode ? selectedNode.name : 'Click node'}
        </span>
      </div>

      <div style={{
        background: 'var(--bg, #0f172a)',
        border: '1px solid var(--border, #1e293b)',
        borderRadius: '10px',
        padding: '8px 4px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <TreeNode
          node={tree}
          expanded={expanded}
          onToggle={toggleExpand}
          onSelect={setSelectedNode}
          activeId={selectedNode?.id}
        />
      </div>

      {selectedNode && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
          Selected: <strong style={{ color: '#fff' }}>{selectedNode.name}</strong> ({selectedNode.type})
        </div>
      )}
    </div>
  );
};`;

    return { starter, solution };
  }

  // 2. Timer / Countdown / Stopwatch / Clock / Pomodoro
  if (t.includes('timer') || t.includes('countdown') || t.includes('stopwatch') || t.includes('clock') || t.includes('pomodoro') || t.includes('metronome')) {
    const isCountdown = t.includes('countdown') || t.includes('pomodoro');
    const defaultSecs = isCountdown ? 60 : 0;

    const starter = `import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const [seconds, setSeconds] = useState(${defaultSecs});
  const [isRunning, setIsRunning] = useState(false);
  const [initialTime, setInitialTime] = useState(${defaultSecs});

  // TODO 1: Implement timer interval using useEffect and useRef
  // TODO 2: Handle Start, Pause, and Reset actions
  // TODO 3: Add formatTime helper (MM:SS)
  // TODO 4: Handle boundary condition when countdown reaches 0

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.15)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>

      {/* Timer Display */}
      <div style={{
        fontSize: '56px',
        fontWeight: '800',
        textAlign: 'center',
        margin: '24px 0',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '2px'
      }}>
        {seconds}s
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--grad-brand, #3b82f6)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          {isRunning ? 'Pause' : 'Start'}
        </button>
        <button
          onClick={() => { setIsRunning(false); setSeconds(${defaultSecs}); }}
          style={{
            padding: '10px 20px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'transparent',
            color: 'var(--text-secondary, #94a3b8)',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
};`;

    const solution = `import React, { useState, useEffect, useRef } from 'react';

export default function App() {
  const initialDuration = ${isCountdown ? 60 : 0};
  const [seconds, setSeconds] = useState(initialDuration);
  const [isRunning, setIsRunning] = useState(false);
  const [laps, setLaps] = useState([]);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setSeconds(prev => {
          ${isCountdown ? `if (prev <= 1) {
            clearInterval(timerRef.current);
            setIsRunning(false);
            return 0;
          }
          return prev - 1;` : `return prev + 1;`}
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainderSecs = secs % 60;
    return \`\${String(mins).padStart(2, '0')}:\${String(remainderSecs).padStart(2, '0')}\`;
  };

  const handleReset = () => {
    setIsRunning(false);
    setSeconds(initialDuration);
    setLaps([]);
  };

  const handleLap = () => {
    setLaps(prev => [formatTime(seconds), ...prev.slice(0, 4)]);
  };

  const progressPct = ${isCountdown ? `Math.round(((60 - seconds) / 60) * 100)` : `Math.min(100, Math.round((seconds / 60) * 100))`};

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{
          fontSize: '11px',
          padding: '3px 8px',
          borderRadius: '100px',
          background: isRunning ? 'rgba(34, 197, 94, 0.15)' : 'rgba(148, 163, 184, 0.15)',
          color: isRunning ? '#22c55e' : '#94a3b8',
          fontWeight: '700'
        }}>
          {isRunning ? 'RUNNING' : 'PAUSED'}
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{ height: '6px', background: 'var(--bg, #0f172a)', borderRadius: '999px', overflow: 'hidden', marginBottom: '20px' }}>
        <div style={{
          width: \`\${progressPct}%\`,
          height: '100%',
          background: isRunning ? 'linear-gradient(90deg, #38bdf8, #818cf8)' : '#64748b',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* Formatted Time Display */}
      <div style={{
        fontSize: '60px',
        fontWeight: '800',
        textAlign: 'center',
        margin: '16px 0',
        fontVariantNumeric: 'tabular-nums',
        letterSpacing: '2px',
        color: seconds === 0 && isRunning === false && initialDuration > 0 ? '#ef4444' : 'var(--text-primary, #fff)'
      }}>
        {formatTime(seconds)}
      </div>

      {/* Interactive Controls */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        <button
          onClick={() => setIsRunning(!isRunning)}
          style={{
            flex: 2,
            padding: '12px',
            borderRadius: '8px',
            border: 'none',
            background: isRunning ? '#ef4444' : 'var(--grad-brand, #3b82f6)',
            color: '#fff',
            fontWeight: '700',
            cursor: 'pointer',
            fontSize: '14px'
          }}
        >
          {isRunning ? 'Pause' : 'Start Timer'}
        </button>
        <button
          onClick={handleLap}
          disabled={!isRunning}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'var(--btn-secondary-bg, #334155)',
            color: isRunning ? 'var(--text-primary, #fff)' : '#64748b',
            fontWeight: '600',
            cursor: isRunning ? 'pointer' : 'not-allowed'
          }}
        >
          Lap
        </button>
        <button
          onClick={handleReset}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'transparent',
            color: 'var(--text-secondary, #94a3b8)',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>

      {/* Laps List */}
      {laps.length > 0 && (
        <div style={{ background: 'var(--bg, #0f172a)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border, #1e293b)' }}>
          <div style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', marginBottom: '8px' }}>
            SPLIT / LAP RECORDS
          </div>
          {laps.map((lap, idx) => (
            <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
              <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Lap #{laps.length - idx}</span>
              <span style={{ fontWeight: '600', fontVariantNumeric: 'tabular-nums' }}>{lap}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};`;

    return { starter, solution };
  }

  // 3. File Upload / Dropzone / Attachment
  if (t.includes('upload') || t.includes('dropzone') || t.includes('attachment') || (t.includes('file') && !t.includes('explorer'))) {
    const starter = `import React, { useState, useRef } from 'react';

export default function App() {
  const [files, setFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  // TODO 1: Implement onDragOver, onDragLeave, onDrop event listeners
  // TODO 2: Support manual file selection via hidden input ref
  // TODO 3: Simulate realistic file upload progress for each file
  // TODO 4: Provide file removal and cancel functionality

  return (
    <div style={{
      maxWidth: '480px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>

      {/* Drop Zone Box */}
      <div
        style={{
          border: \`2px dashed \${isDragging ? 'var(--accent, #38bdf8)' : 'var(--border, #475569)'}\`,
          borderRadius: '12px',
          padding: '36px 20px',
          textAlign: 'center',
          background: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg, #0f172a)',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>📁</div>
        <div style={{ fontWeight: '600', marginBottom: '4px' }}>Drag & drop files here, or browse</div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>Supports PNG, JPG, PDF up to 10MB</div>
        <input ref={fileInputRef} type="file" multiple style={{ display: 'none' }} />
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState, useRef } from 'react';

export default function App() {
  const [files, setFiles] = useState([
    { id: '1', name: 'interview_spec.pdf', size: 1024 * 450, progress: 100, status: 'complete' },
    { id: '2', name: 'system_architecture.png', size: 1024 * 1280, progress: 65, status: 'uploading' }
  ]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleFiles = (incomingFiles) => {
    const newItems = Array.from(incomingFiles).map((file, idx) => ({
      id: Date.now() + '-' + idx,
      name: file.name,
      size: file.size,
      progress: 0,
      status: 'uploading'
    }));

    setFiles(prev => [...newItems, ...prev]);

    // Simulate progress
    newItems.forEach(item => {
      let currentProgress = 0;
      const interval = setInterval(() => {
        currentProgress += Math.floor(Math.random() * 25) + 10;
        if (currentProgress >= 100) {
          currentProgress = 100;
          clearInterval(interval);
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: 100, status: 'complete' } : f));
        } else {
          setFiles(prev => prev.map(f => f.id === item.id ? { ...f, progress: currentProgress } : f));
        }
      }, 300);
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const removeFile = (id) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  return (
    <div style={{
      maxWidth: '500px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
          {files.length} {files.length === 1 ? 'file' : 'files'}
        </span>
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: \`2px dashed \${isDragging ? '#38bdf8' : 'var(--border, #475569)'}\`,
          borderRadius: '12px',
          padding: '30px 16px',
          textAlign: 'center',
          background: isDragging ? 'rgba(56, 189, 248, 0.08)' : 'var(--bg, #0f172a)',
          cursor: 'pointer',
          transition: 'all 0.2s',
          marginBottom: '20px'
        }}
      >
        <div style={{ fontSize: '32px', marginBottom: '8px' }}>☁️</div>
        <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
          Drop files to upload, or <span style={{ color: '#38bdf8' }}>browse</span>
        </div>
        <div style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
          PNG, JPG, PDF, ZIP up to 25MB
        </div>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          style={{ display: 'none' }}
        />
      </div>

      {/* File Upload List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {files.map(file => (
          <div
            key={file.id}
            style={{
              padding: '12px',
              background: 'var(--bg, #0f172a)',
              borderRadius: '8px',
              border: '1px solid var(--border, #1e293b)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
                <span style={{ fontSize: '16px' }}>📄</span>
                <span style={{ fontSize: '13px', fontWeight: '500', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                  {file.name}
                </span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-secondary, #94a3b8)' }}>
                  {formatSize(file.size)}
                </span>
                <button
                  onClick={() => removeFile(file.id)}
                  style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '2px 6px' }}
                  title="Remove file"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div style={{ height: '5px', background: '#334155', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                height: '100%',
                width: \`\${file.progress}%\`,
                background: file.status === 'complete' ? '#22c55e' : 'var(--grad-brand, #38bdf8)',
                transition: 'width 0.2s ease'
              }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginTop: '4px', color: '#94a3b8' }}>
              <span>{file.status === 'complete' ? '✓ Uploaded' : 'Uploading...'}</span>
              <span>{file.progress}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

    return { starter, solution };
  }

  // 3. Multi-Select / Checkbox Dropdown / Tag Input / Combobox
  if (t.includes('multi-select') || t.includes('dropdown') || t.includes('checkbox dropdown') || t.includes('tag input') || t.includes('combobox')) {
    const starter = `import React, { useState } from 'react';

const OPTIONS = [
  'React 19', 'TypeScript', 'Next.js', 'Tailwind CSS',
  'GraphQL', 'Node.js', 'Docker', 'Jest & Vitest'
];

export default function App() {
  const [selected, setSelected] = useState(['React 19']);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  // TODO 1: Implement toggle selection handler (add/remove from selected list)
  // TODO 2: Filter options by search keyword
  // TODO 3: Implement Select All and Clear All controls
  // TODO 4: Display selected items as removable tag badges

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>

      {/* Trigger Box */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border, #475569)',
          background: 'var(--bg, #0f172a)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <span>{selected.length ? \`\${selected.length} items selected\` : 'Select items...'}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState, useRef, useEffect } from 'react';

const ALL_OPTIONS = [
  'React 19', 'TypeScript 5.8', 'Next.js App Router', 'Tailwind CSS v4',
  'GraphQL & Apollo', 'Node.js LTS', 'Docker Containers', 'Jest & Playwright',
  'Redux Toolkit', 'WebSockets & WebRTC'
];

export default function App() {
  const [selected, setSelected] = useState(['React 19', 'TypeScript 5.8']);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleOption = (opt) => {
    setSelected(prev =>
      prev.includes(opt) ? prev.filter(item => item !== opt) : [...prev, opt]
    );
  };

  const removeTag = (opt, e) => {
    e.stopPropagation();
    setSelected(prev => prev.filter(item => item !== opt));
  };

  const selectAll = () => setSelected([...ALL_OPTIONS]);
  const clearAll = () => setSelected([]);

  const filteredOptions = ALL_OPTIONS.filter(opt =>
    opt.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={dropdownRef} style={{
      maxWidth: '480px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '18px' }}>
        ${title}
      </h2>

      {/* Selected Tags Display */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '12px' }}>
        {selected.map(item => (
          <span
            key={item}
            style={{
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '999px',
              background: 'rgba(56, 189, 248, 0.15)',
              color: '#38bdf8',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              border: '1px solid rgba(56, 189, 248, 0.3)'
            }}
          >
            {item}
            <button
              onClick={(e) => removeTag(item, e)}
              style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: 0, fontSize: '11px', fontWeight: 'bold' }}
            >
              ✕
            </button>
          </span>
        ))}
      </div>

      {/* Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          padding: '12px 14px',
          borderRadius: '8px',
          border: '1px solid var(--border, #475569)',
          background: 'var(--bg, #0f172a)',
          cursor: 'pointer',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          userSelect: 'none'
        }}
      >
        <span style={{ fontSize: '14px' }}>
          {selected.length ? \`\${selected.length} of \${ALL_OPTIONS.length} selected\` : 'Choose options...'}
        </span>
        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{isOpen ? '▲' : '▼'}</span>
      </div>

      {/* Dropdown Menu Popover */}
      {isOpen && (
        <div style={{
          marginTop: '8px',
          background: 'var(--bg, #0f172a)',
          border: '1px solid var(--border, #334155)',
          borderRadius: '10px',
          padding: '12px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.3)'
        }}>
          <input
            type="text"
            placeholder="Search options..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '8px 10px',
              borderRadius: '6px',
              border: '1px solid var(--border, #475569)',
              background: 'var(--surface, #1e222d)',
              color: '#fff',
              fontSize: '13px',
              marginBottom: '10px',
              boxSizing: 'border-box'
            }}
          />

          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
            <button onClick={selectAll} style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer' }}>
              Select All
            </button>
            <button onClick={clearAll} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}>
              Clear All
            </button>
          </div>

          <div style={{ maxHeight: '180px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {filteredOptions.map(opt => {
              const isChecked = selected.includes(opt);
              return (
                <label
                  key={opt}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    padding: '6px 8px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '13px',
                    background: isChecked ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                    color: isChecked ? '#fff' : 'var(--text-secondary, #cbd5e1)'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleOption(opt)}
                    style={{ cursor: 'pointer' }}
                  />
                  <span>{opt}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}`;

    return { starter, solution };
  }

  // 4. Transfer List / Two-Column Selector
  if (t.includes('transfer list') || t.includes('two-column selector')) {
    const starter = `import React, { useState } from 'react';

const INITIAL_LEFT = ['TypeScript', 'React.js', 'Next.js', 'Docker', 'GraphQL'];
const INITIAL_RIGHT = ['CSS3', 'HTML5'];

export default function App() {
  const [left, setLeft] = useState(INITIAL_LEFT);
  const [right, setRight] = useState(INITIAL_RIGHT);
  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  // TODO 1: Implement moveRight (move selectedLeft items to right list)
  // TODO 2: Implement moveLeft (move selectedRight items to left list)
  // TODO 3: Implement moveAllRight and moveAllLeft
  // TODO 4: Clear selection states after transfer

  return (
    <div style={{
      maxWidth: '560px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>

      <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
        {/* Left Column */}
        <div style={{ flex: 1, padding: '12px', background: 'var(--bg, #0f172a)', borderRadius: '8px', minHeight: '160px' }}>
          <h4>Available ({left.length})</h4>
        </div>

        {/* Transfer Action Buttons */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <button>{'>'}</button>
          <button>{'<'}</button>
        </div>

        {/* Right Column */}
        <div style={{ flex: 1, padding: '12px', background: 'var(--bg, #0f172a)', borderRadius: '8px', minHeight: '160px' }}>
          <h4>Selected ({right.length})</h4>
        </div>
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState } from 'react';

const INITIAL_LEFT = ['TypeScript', 'React 19', 'Next.js App Router', 'Docker', 'GraphQL API', 'Vitest Unit Tests'];
const INITIAL_RIGHT = ['CSS3 Modules', 'Semantic HTML5'];

export default function App() {
  const [left, setLeft] = useState(INITIAL_LEFT);
  const [right, setRight] = useState(INITIAL_RIGHT);
  const [selectedLeft, setSelectedLeft] = useState([]);
  const [selectedRight, setSelectedRight] = useState([]);

  const toggleSelectLeft = (item) => {
    setSelectedLeft(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const toggleSelectRight = (item) => {
    setSelectedRight(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const moveRight = () => {
    setRight(prev => [...prev, ...selectedLeft]);
    setLeft(prev => prev.filter(i => !selectedLeft.includes(i)));
    setSelectedLeft([]);
  };

  const moveLeft = () => {
    setLeft(prev => [...prev, ...selectedRight]);
    setRight(prev => prev.filter(i => !selectedRight.includes(i)));
    setSelectedRight([]);
  };

  const moveAllRight = () => {
    setRight(prev => [...prev, ...left]);
    setLeft([]);
    setSelectedLeft([]);
  };

  const moveAllLeft = () => {
    setLeft(prev => [...prev, ...right]);
    setRight([]);
    setSelectedRight([]);
  };

  return (
    <div style={{
      maxWidth: '600px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '18px' }}>
        ${title}
      </h2>

      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {/* Left Column */}
        <div style={{
          flex: 1,
          padding: '12px',
          background: 'var(--bg, #0f172a)',
          borderRadius: '10px',
          border: '1px solid var(--border, #1e293b)',
          height: '240px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
            <span>Available</span>
            <span style={{ color: '#38bdf8' }}>{left.length}</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {left.map(item => (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: selectedLeft.includes(item) ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedLeft.includes(item)}
                  onChange={() => toggleSelectLeft(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Transfer Action Controls */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <button
            onClick={moveAllRight}
            disabled={left.length === 0}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#334155', color: '#fff', cursor: 'pointer' }}
            title="Move All Right"
          >
            ≫
          </button>
          <button
            onClick={moveRight}
            disabled={selectedLeft.length === 0}
            style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
            title="Move Selected Right"
          >
            &gt;
          </button>
          <button
            onClick={moveLeft}
            disabled={selectedRight.length === 0}
            style={{ padding: '8px 12px', borderRadius: '6px', border: 'none', background: '#38bdf8', color: '#0f172a', fontWeight: 'bold', cursor: 'pointer' }}
            title="Move Selected Left"
          >
            &lt;
          </button>
          <button
            onClick={moveAllLeft}
            disabled={right.length === 0}
            style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #475569', background: '#334155', color: '#fff', cursor: 'pointer' }}
            title="Move All Left"
          >
            ≪
          </button>
        </div>

        {/* Right Column */}
        <div style={{
          flex: 1,
          padding: '12px',
          background: 'var(--bg, #0f172a)',
          borderRadius: '10px',
          border: '1px solid var(--border, #1e293b)',
          height: '240px',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px', fontWeight: '600' }}>
            <span>Selected</span>
            <span style={{ color: '#22c55e' }}>{right.length}</span>
          </div>
          <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {right.map(item => (
              <label
                key={item}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '6px 8px',
                  borderRadius: '6px',
                  background: selectedRight.includes(item) ? 'rgba(34, 197, 94, 0.15)' : 'transparent',
                  cursor: 'pointer',
                  fontSize: '13px'
                }}
              >
                <input
                  type="checkbox"
                  checked={selectedRight.includes(item)}
                  onChange={() => toggleSelectRight(item)}
                />
                <span>{item}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}`;

    return { starter, solution };
  }

  // 5. Tree View / Nested File Explorer / Hierarchy
  if (t.includes('tree') || t.includes('file explorer') || t.includes('nested')) {
    const starter = `import React, { useState } from 'react';

const INITIAL_TREE = {
  id: 'root',
  name: 'src',
  type: 'folder',
  children: [
    {
      id: 'comp',
      name: 'components',
      type: 'folder',
      children: [
        { id: '1', name: 'Header.tsx', type: 'file' },
        { id: '2', name: 'Sidebar.tsx', type: 'file' }
      ]
    },
    { id: '3', name: 'App.tsx', type: 'file' },
    { id: '4', name: 'main.css', type: 'file' }
  ]
};

export default function App() {
  const [tree, setTree] = useState(INITIAL_TREE);
  const [expanded, setExpanded] = useState({ root: true, comp: true });

  // TODO 1: Implement recursive TreeNode component
  // TODO 2: Support folder expand/collapse toggle
  // TODO 3: Distinguish between folder and file icons
  // TODO 4: Add file or delete node actions

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>
      <div style={{ background: 'var(--bg, #0f172a)', padding: '16px', borderRadius: '10px' }}>
        {/* Render tree here */}
        <div>📁 {tree.name}</div>
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState } from 'react';

const INITIAL_TREE = {
  id: 'root',
  name: 'project-root',
  type: 'folder',
  children: [
    {
      id: 'src',
      name: 'src',
      type: 'folder',
      children: [
        {
          id: 'components',
          name: 'components',
          type: 'folder',
          children: [
            { id: 'nav', name: 'Navbar.tsx', type: 'file' },
            { id: 'btn', name: 'Button.tsx', type: 'file' }
          ]
        },
        { id: 'hooks', name: 'useDebounce.ts', type: 'file' },
        { id: 'app', name: 'App.tsx', type: 'file' },
        { id: 'css', name: 'index.css', type: 'file' }
      ]
    },
    { id: 'pkg', name: 'package.json', type: 'file' },
    { id: 'readme', name: 'README.md', type: 'file' }
  ]
};

function TreeNode({ node, level = 0, expanded, onToggle, onSelect, activeId }) {
  const isFolder = node.type === 'folder';
  const isExpanded = !!expanded[node.id];
  const isSelected = activeId === node.id;

  return (
    <div>
      <div
        onClick={() => {
          if (isFolder) onToggle(node.id);
          onSelect(node);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '5px 8px',
          paddingLeft: \`\${level * 16 + 8}px\`,
          borderRadius: '6px',
          cursor: 'pointer',
          background: isSelected ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
          color: isSelected ? '#38bdf8' : 'var(--text-primary, #f8fafc)',
          fontSize: '13px',
          userSelect: 'none'
        }}
      >
        {isFolder ? (
          <span style={{ fontSize: '10px', width: '12px', display: 'inline-block', color: '#94a3b8' }}>
            {isExpanded ? '▼' : '▶'}
          </span>
        ) : (
          <span style={{ width: '12px' }} />
        )}
        <span>{isFolder ? (isExpanded ? '📂' : '📁') : '📄'}</span>
        <span style={{ fontWeight: isFolder ? '600' : '400' }}>{node.name}</span>
      </div>

      {isFolder && isExpanded && node.children && (
        <div>
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              expanded={expanded}
              onToggle={onToggle}
              onSelect={onSelect}
              activeId={activeId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function App() {
  const [tree, setTree] = useState(INITIAL_TREE);
  const [expanded, setExpanded] = useState({ root: true, src: true, components: false });
  const [selectedNode, setSelectedNode] = useState(null);

  const toggleExpand = (id) => {
    setExpanded(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div style={{
      maxWidth: '480px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
          {selectedNode ? selectedNode.name : 'Click node'}
        </span>
      </div>

      <div style={{
        background: 'var(--bg, #0f172a)',
        border: '1px solid var(--border, #1e293b)',
        borderRadius: '10px',
        padding: '8px 4px',
        maxHeight: '300px',
        overflowY: 'auto'
      }}>
        <TreeNode
          node={tree}
          expanded={expanded}
          onToggle={toggleExpand}
          onSelect={setSelectedNode}
          activeId={selectedNode?.id}
        />
      </div>

      {selectedNode && (
        <div style={{ marginTop: '12px', padding: '10px 14px', background: 'rgba(56, 189, 248, 0.08)', borderRadius: '8px', fontSize: '12px', color: '#94a3b8' }}>
          Selected: <strong style={{ color: '#fff' }}>{selectedNode.name}</strong> ({selectedNode.type})
        </div>
      )}
    </div>
  );
}`;

    return { starter, solution };
  }

  // 6. OTP 6-Digit Auto-Focus Input
  if (t.includes('otp') || t.includes('pin') || t.includes('6-digit')) {
    const starter = `import React, { useState, useRef } from 'react';

export default function App() {
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const inputRefs = useRef([]);

  // TODO 1: Handle typing and auto-focusing next input
  // TODO 2: Handle Backspace to move focus to previous input
  // TODO 3: Support pasting full 6-digit code
  // TODO 4: Provide verification trigger

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      textAlign: 'center'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', margin: '24px 0' }}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            maxLength={1}
            value={digit}
            style={{
              width: '42px',
              height: '50px',
              fontSize: '20px',
              textAlign: 'center',
              borderRadius: '8px',
              border: '1px solid var(--border, #475569)',
              background: 'var(--bg, #0f172a)',
              color: '#fff'
            }}
          />
        ))}
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState, useRef, useEffect } from 'react';

export default function App() {
  const length = 6;
  const [otp, setOtp] = useState(new Array(length).fill(''));
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (val, idx) => {
    if (!/^\\d*$/.test(val)) return;
    const newOtp = [...otp];
    newOtp[idx] = val.slice(-1);
    setOtp(newOtp);
    setVerified(false);
    setError(false);

    if (val && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === 'Backspace') {
      if (!otp[idx] && idx > 0) {
        inputRefs.current[idx - 1]?.focus();
      }
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').trim().slice(0, length);
    if (!/^\\d+$/.test(pasteData)) return;

    const newOtp = [...otp];
    pasteData.split('').forEach((char, i) => {
      newOtp[i] = char;
    });
    setOtp(newOtp);
    const focusTarget = Math.min(pasteData.length, length - 1);
    inputRefs.current[focusTarget]?.focus();
  };

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length === length) {
      setVerified(true);
      setError(false);
    } else {
      setError(true);
      setVerified(false);
    }
  };

  const handleClear = () => {
    setOtp(new Array(length).fill(''));
    setVerified(false);
    setError(false);
    inputRefs.current[0]?.focus();
  };

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '28px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      textAlign: 'center',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <h2 style={{ margin: '0 0 8px', color: 'var(--accent, #60a5fa)', fontSize: '18px' }}>
        ${title}
      </h2>
      <p style={{ fontSize: '13px', color: 'var(--text-secondary, #94a3b8)', margin: '0 0 24px' }}>
        Enter the 6-digit security code sent to your authentication device
      </p>

      {/* 6 OTP Inputs */}
      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => (inputRefs.current[idx] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e.target.value, idx)}
            onKeyDown={(e) => handleKeyDown(e, idx)}
            onPaste={handlePaste}
            style={{
              width: '44px',
              height: '52px',
              fontSize: '22px',
              fontWeight: '700',
              textAlign: 'center',
              borderRadius: '8px',
              border: \`2px solid \${digit ? '#38bdf8' : 'var(--border, #475569)'}\`,
              background: 'var(--bg, #0f172a)',
              color: '#fff',
              outline: 'none',
              transition: 'border-color 0.2s'
            }}
          />
        ))}
      </div>

      {verified && (
        <div style={{ padding: '8px', background: 'rgba(34, 197, 94, 0.15)', color: '#22c55e', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
          ✓ Code Verified: {otp.join('')}
        </div>
      )}

      {error && (
        <div style={{ padding: '8px', background: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', borderRadius: '6px', fontSize: '13px', fontWeight: '600', marginBottom: '16px' }}>
          Please fill in all 6 digits
        </div>
      )}

      <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
        <button
          onClick={handleVerify}
          style={{
            padding: '10px 24px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--grad-brand, #3b82f6)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Verify Code
        </button>
        <button
          onClick={handleClear}
          style={{
            padding: '10px 18px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'transparent',
            color: 'var(--text-secondary, #94a3b8)',
            cursor: 'pointer'
          }}
        >
          Clear
        </button>
      </div>
    </div>
  );
}`;

    return { starter, solution };
  }

  // 7. Custom Hooks
  if (t.startsWith('custom hook') || t.startsWith('use') || category === 'Custom Hooks') {
    const hookName = t.match(/use[A-Za-z0-9]+/i)?.[0] || 'useCustomFeature';

    const starter = `import React, { useState, useEffect } from 'react';

// TODO: Implement \`${hookName}\` hook with proper parameters and cleanup
function ${hookName}(param) {
  const [state, setState] = useState(param);
  return state;
}

export default function App() {
  const [inputVal, setInputVal] = useState('Hello React 19');
  const result = ${hookName}(inputVal);

  return (
    <div style={{
      maxWidth: '460px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>
      <input
        type="text"
        value={inputVal}
        onChange={(e) => setInputVal(e.target.value)}
        style={{
          width: '100%',
          padding: '10px',
          borderRadius: '8px',
          border: '1px solid var(--border, #475569)',
          background: 'var(--bg, #0f172a)',
          color: '#fff',
          boxSizing: 'border-box'
        }}
      />
      <div style={{ marginTop: '16px', fontSize: '14px' }}>
        Hook Result: <strong>{String(result)}</strong>
      </div>
    </div>
  );
}`;

    const solution = `import React, { useState, useEffect, useRef } from 'react';

// Production implementation of \`${hookName}\`
function ${hookName}(value, delay = 500) {
  const [hookValue, setHookValue] = useState(value);
  const [changeCount, setChangeCount] = useState(0);

  useEffect(() => {
    const handler = setTimeout(() => {
      setHookValue(value);
      setChangeCount(c => c + 1);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return { value: hookValue, changeCount };
}

export default function App() {
  const [text, setText] = useState('Real-time React Hook Query');
  const [delay, setDelay] = useState(400);
  const { value: debouncedValue, changeCount } = ${hookName}(text, delay);

  return (
    <div style={{
      maxWidth: '480px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{ fontSize: '12px', color: '#22c55e', background: 'rgba(34,197,94,0.15)', padding: '3px 8px', borderRadius: '6px', fontWeight: '700' }}>
          ACTIVE HOOK
        </span>
      </div>

      <div style={{ marginBottom: '16px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: 'var(--text-secondary, #94a3b8)', marginBottom: '6px' }}>
          Input Text Stream:
        </label>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'var(--bg, #0f172a)',
            color: '#fff',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#94a3b8', marginBottom: '4px' }}>
          <span>Hook Latency / Delay:</span>
          <span>{delay}ms</span>
        </div>
        <input
          type="range"
          min="100"
          max="1500"
          step="50"
          value={delay}
          onChange={(e) => setDelay(Number(e.target.value))}
          style={{ width: '100%', cursor: 'pointer' }}
        />
      </div>

      {/* Live Inspection Card */}
      <div style={{
        background: 'var(--bg, #0f172a)',
        padding: '16px',
        borderRadius: '10px',
        border: '1px solid var(--border, #1e293b)'
      }}>
        <div style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
          Hook Reactive State
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Immediate Value:</span>
            <span style={{ fontWeight: '500' }}>{text}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Hook Output:</span>
            <strong style={{ color: '#38bdf8' }}>{debouncedValue}</strong>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: 'var(--text-secondary, #94a3b8)' }}>Sync Cycles:</span>
            <span style={{ fontVariantNumeric: 'tabular-nums' }}>{changeCount}</span>
          </div>
        </div>
      </div>
    </div>
  );
}`;

    return { starter, solution };
  }

  // 8. General Interactive Component Fallback
  const starter = `import React, { useState } from 'react';

export default function App() {
  const [data, setData] = useState([
    { id: 1, title: 'Primary Item A', status: 'Active', count: 12 },
    { id: 2, title: 'Secondary Item B', status: 'Pending', count: 5 }
  ]);
  const [filter, setFilter] = useState('All');
  const [inputValue, setInputValue] = useState('');

  // TODO 1: Implement state updates for this ${title} scenario
  // TODO 2: Support item addition, status toggle, or removal
  // TODO 3: Filter items according to active selection

  return (
    <div style={{
      maxWidth: '500px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)'
    }}>
      <h2 style={{ margin: '0 0 16px', color: 'var(--accent, #60a5fa)', fontSize: '20px' }}>
        ${title}
      </h2>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="New entry..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'var(--bg, #0f172a)',
            color: '#fff'
          }}
        />
        <button style={{ padding: '8px 16px', borderRadius: '8px', background: 'var(--grad-brand, #3b82f6)', color: '#fff', border: 'none' }}>
          Add
        </button>
      </div>
    </div>
  );
}`;

  const solution = `import React, { useState } from 'react';

export default function App() {
  const [items, setItems] = useState([
    { id: 1, label: 'Production Security Gate', active: true, metric: '99.9%' },
    { id: 2, label: 'State Reducer Synchronization', active: true, metric: '14ms' },
    { id: 3, label: 'Dynamic Cache Revalidation', active: false, metric: 'Idle' }
  ]);
  const [filter, setFilter] = useState('All');
  const [newLabel, setNewLabel] = useState('');

  const toggleItem = (id) => {
    setItems(prev => prev.map(item => item.id === id ? { ...item, active: !item.active } : item));
  };

  const addItem = (e) => {
    e.preventDefault();
    if (!newLabel.trim()) return;
    setItems(prev => [...prev, { id: Date.now(), label: newLabel.trim(), active: true, metric: 'New' }]);
    setNewLabel('');
  };

  const removeItem = (id) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const filtered = items.filter(item => {
    if (filter === 'Active') return item.active;
    if (filter === 'Inactive') return !item.active;
    return true;
  });

  return (
    <div style={{
      maxWidth: '500px',
      margin: '24px auto',
      padding: '24px',
      background: 'var(--surface, #1e222d)',
      border: '1px solid var(--border, #334155)',
      borderRadius: '16px',
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'var(--text-primary, #f8fafc)',
      boxShadow: '0 8px 24px rgba(0,0,0,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <h2 style={{ margin: 0, fontSize: '18px', color: 'var(--accent, #60a5fa)' }}>
          ${title}
        </h2>
        <span style={{ fontSize: '12px', color: 'var(--text-secondary, #94a3b8)' }}>
          {items.length} records
        </span>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '6px', marginBottom: '16px' }}>
        {['All', 'Active', 'Inactive'].map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            style={{
              padding: '4px 12px',
              fontSize: '12px',
              borderRadius: '6px',
              border: 'none',
              background: filter === tab ? 'var(--grad-brand, #38bdf8)' : 'var(--btn-secondary-bg, #334155)',
              color: filter === tab ? '#0f172a' : 'var(--text-primary, #fff)',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Form Input */}
      <form onSubmit={addItem} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        <input
          type="text"
          value={newLabel}
          onChange={(e) => setNewLabel(e.target.value)}
          placeholder="Add component element..."
          style={{
            flex: 1,
            padding: '8px 12px',
            borderRadius: '8px',
            border: '1px solid var(--border, #475569)',
            background: 'var(--bg, #0f172a)',
            color: '#fff',
            fontSize: '13px'
          }}
        />
        <button
          type="submit"
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            background: 'var(--grad-brand, #3b82f6)',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          Add
        </button>
      </form>

      {/* Item List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {filtered.map(item => (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '10px 12px',
              borderRadius: '8px',
              background: 'var(--bg, #0f172a)',
              border: '1px solid var(--border, #1e293b)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <button
                onClick={() => toggleItem(item.id)}
                style={{
                  width: '18px',
                  height: '18px',
                  borderRadius: '4px',
                  border: \`2px solid \${item.active ? '#22c55e' : '#64748b'}\`,
                  background: item.active ? '#22c55e' : 'transparent',
                  color: '#fff',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '11px',
                  padding: 0
                }}
              >
                {item.active ? '✓' : ''}
              </button>
              <span style={{ fontSize: '13px', textDecoration: item.active ? 'none' : 'line-through', color: item.active ? '#fff' : '#64748b' }}>
                {item.label}
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '11px', color: '#38bdf8', background: 'rgba(56,189,248,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                {item.metric}
              </span>
              <button
                onClick={() => removeItem(item.id)}
                style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', fontSize: '14px', padding: '2px 4px' }}
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}`;

  return { starter, solution };
}
