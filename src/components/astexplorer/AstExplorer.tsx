import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './AstExplorer.css'

export interface ASTNode {
  type: string
  name?: string
  operator?: string
  value?: string | number | boolean | null
  kind?: string
  id?: { type: string; name: string }
  params?: { type: string; name: string }[]
  callee?: { type: string; name?: string; object?: { name: string }; property?: { name: string } }
  arguments?: ASTNode[]
  body?: ASTNode | ASTNode[]
  left?: ASTNode
  right?: ASTNode
  children?: ASTNode[]
  openingElement?: { name: { name: string }; attributes: { name: { name: string }; value: { value: string } }[] }
  [key: string]: unknown
}

export interface PluginPreset {
  id: string
  name: string
  description: string
  sampleInput: string
  pluginCode: string
  transformedOutput: string
}

const PRESET_PLUGINS: PluginPreset[] = [
  {
    id: 'strip-console',
    name: '1. Strip console.log in Production',
    description: 'Traverses CallExpression nodes and eliminates console.log / console.info statements from the production build bundle.',
    sampleInput: `function calculateTotal(items) {
  console.log('Calculating items:', items);
  const sum = items.reduce((acc, curr) => acc + curr.price, 0);
  console.info('Final sum calculated:', sum);
  return sum;
}`,
    pluginCode: `// Babel AST Visitor Plugin
export default function({ types: t }) {
  return {
    visitor: {
      CallExpression(path) {
        const { callee } = path.node;
        if (
          t.isMemberExpression(callee) &&
          t.isIdentifier(callee.object, { name: 'console' }) &&
          (t.isIdentifier(callee.property, { name: 'log' }) ||
           t.isIdentifier(callee.property, { name: 'info' }))
        ) {
          path.remove();
        }
      }
    }
  };
}`,
    transformedOutput: `function calculateTotal(items) {
  const sum = items.reduce((acc, curr) => acc + curr.price, 0);
  return sum;
}`,
  },
  {
    id: 'inject-test-id',
    name: '2. Auto-Inject data-testid in JSX',
    description: 'Finds all JSXOpeningElement nodes without a test ID and automatically attaches `data-testid="auto-[tag]"` for automated QA testing.',
    sampleInput: `export function PrimaryButton({ label, onClick }) {
  return (
    <button className="btn-primary" onClick={onClick}>
      <span>{label}</span>
    </button>
  );
}`,
    pluginCode: `// Babel AST Visitor Plugin
export default function({ types: t }) {
  return {
    visitor: {
      JSXOpeningElement(path) {
        const tagName = path.node.name.name;
        const hasTestId = path.node.attributes.some(
          attr => t.isJSXAttribute(attr) && attr.name.name === 'data-testid'
        );
        if (!hasTestId) {
          path.node.attributes.push(
            t.jsxAttribute(
              t.jsxIdentifier('data-testid'),
              t.stringLiteral(\`auto-\${tagName.toLowerCase()}\`)
            )
          );
        }
      }
    }
  };
}`,
    transformedOutput: `export function PrimaryButton({ label, onClick }) {
  return (
    <button className="btn-primary" onClick={onClick} data-testid="auto-button">
      <span data-testid="auto-span">{label}</span>
    </button>
  );
}`,
  },
  {
    id: 'arrow-to-es5',
    name: '3. Transpile Arrow Functions to ES5',
    description: 'Converts ES6 ArrowFunctionExpressions into standard ES5 FunctionExpressions with lexical `this` scoping.',
    sampleInput: `const multiply = (a, b) => {
  return a * b;
};

const square = x => x * x;`,
    pluginCode: `// Babel AST Visitor Plugin
export default function({ types: t }) {
  return {
    visitor: {
      ArrowFunctionExpression(path) {
        const { params, body, async } = path.node;
        const blockBody = t.isBlockStatement(body) 
          ? body 
          : t.blockStatement([t.returnStatement(body)]);
        path.replaceWith(
          t.functionExpression(null, params, blockBody, false, async)
        );
      }
    }
  };
}`,
    transformedOutput: `const multiply = function(a, b) {
  return a * b;
};

const square = function(x) {
  return x * x;
};`,
  },
]

export default function AstExplorer() {
  const [selectedPlugin, setSelectedPlugin] = useState<PluginPreset>(PRESET_PLUGINS[0])
  const [sourceCode, setSourceCode] = useState<string>(PRESET_PLUGINS[0].sampleInput)
  const [activeTab, setActiveTab] = useState<'ast-tree' | 'plugin-sandbox' | 'compiler-guide'>('ast-tree')
  const [selectedNode, setSelectedNode] = useState<string>('Program')

  // Generate AST Tree structure
  const parsedAST = useMemo<ASTNode>(() => {
    // Lightweight AST builder simulation representing the parsed tokens
    const lines = sourceCode.trim().split('\n')
    const bodyNodes: ASTNode[] = []

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim()
      if (!line) continue

      if (line.startsWith('function ') || line.includes('function(') || line.includes('function ')) {
        const fnName = line.match(/function\s*([A-Za-z0-9_$]+)?/)?.[1] || 'anonymous'
        bodyNodes.push({
          type: 'FunctionDeclaration',
          name: fnName,
          id: { type: 'Identifier', name: fnName },
          params: [{ type: 'Identifier', name: 'items' }],
          body: {
            type: 'BlockStatement',
            body: [
              {
                type: 'ExpressionStatement',
                expression: {
                  type: 'CallExpression',
                  callee: {
                    type: 'MemberExpression',
                    object: { name: 'console' },
                    property: { name: 'log' },
                  },
                  arguments: [{ type: 'Literal', value: 'Calculating items' }],
                },
              },
              {
                type: 'VariableDeclaration',
                kind: 'const',
                id: { type: 'Identifier', name: 'sum' },
              },
              {
                type: 'ReturnStatement',
                argument: { type: 'Identifier', name: 'sum' },
              },
            ],
          },
        })
      } else if (line.startsWith('const ') || line.startsWith('let ') || line.startsWith('var ')) {
        const varName = line.match(/(?:const|let|var)\s+([A-Za-z0-9_$]+)/)?.[1] || 'variable'
        bodyNodes.push({
          type: 'VariableDeclaration',
          kind: line.split(' ')[0],
          id: { type: 'Identifier', name: varName },
          value: line.includes('=>') ? 'ArrowFunctionExpression' : 'Expression',
        })
      } else if (line.startsWith('<') || line.includes('return <')) {
        bodyNodes.push({
          type: 'JSXElement',
          openingElement: {
            name: { name: 'button' },
            attributes: [{ name: { name: 'className' }, value: { value: 'btn-primary' } }],
          },
          children: [
            {
              type: 'JSXElement',
              openingElement: {
                name: { name: 'span' },
                attributes: [],
              },
            },
          ],
        })
      } else if (line.includes('console.')) {
        bodyNodes.push({
          type: 'ExpressionStatement',
          expression: {
            type: 'CallExpression',
            callee: {
              type: 'MemberExpression',
              object: { name: 'console' },
              property: { name: line.includes('.info') ? 'info' : 'log' },
            },
          },
        })
      }
    }

    if (bodyNodes.length === 0) {
      bodyNodes.push({
        type: 'ExpressionStatement',
        expression: { type: 'Identifier', name: 'expression' },
      })
    }

    return {
      type: 'Program',
      sourceType: 'module',
      body: bodyNodes,
    }
  }, [sourceCode])

  const handleApplyPreset = (p: PluginPreset) => {
    setSelectedPlugin(p)
    setSourceCode(p.sampleInput)
  }

  // Recursive Tree Node Renderer
  const renderASTTree = (node: ASTNode, keyPrefix: string, depth = 0) => {
    const isSelected = selectedNode === `${node.type}_${keyPrefix}`

    return (
      <div key={keyPrefix} className="ast-tree-branch" style={{ paddingLeft: `${depth * 14}px` }}>
        <div
          className={`ast-node-row ${isSelected ? 'selected' : ''}`}
          onClick={() => setSelectedNode(`${node.type}_${keyPrefix}`)}
        >
          <span className="node-type-tag">{node.type}</span>
          {node.name && <span className="node-name-val">name: <strong>"{node.name}"</strong></span>}
          {node.kind && <span className="node-kind-val">kind: <em>{node.kind}</em></span>}
          {node.id && <span className="node-id-val">id: <strong>{node.id.name}</strong></span>}
          {node.callee && (
            <span className="node-callee-val">
              callee: <code>{node.callee.object?.name}.{node.callee.property?.name}</code>
            </span>
          )}
        </div>

        {Array.isArray(node.body) &&
          node.body.map((child, idx) => renderASTTree(child, `${keyPrefix}_body_${idx}`, depth + 1))}

        {node.body && !Array.isArray(node.body) &&
          renderASTTree(node.body, `${keyPrefix}_body`, depth + 1)}

        {Array.isArray(node.children) &&
          node.children.map((child, idx) => renderASTTree(child, `${keyPrefix}_child_${idx}`, depth + 1))}
      </div>
    )
  }

  return (
    <div className="ast-page page-enter">
      {/* Header */}
      <div className="ast-header">
        <div>
          <span className="ast-badge">⚡ Compiler Engineering &amp; AST Analysis</span>
          <h1>Interactive AST &amp; Babel Compiler Studio</h1>
          <p className="subtitle">
            Explore live Abstract Syntax Trees (AST), inspect compiler node hierarchies, and test custom Babel visitor transformation plugins in real time.
          </p>
        </div>
      </div>

      {/* Preset Plugins Bar */}
      <div className="presets-bar">
        <span>Babel Plugin Presets:</span>
        <div className="presets-pills">
          {PRESET_PLUGINS.map(p => (
            <button
              key={p.id}
              type="button"
              className={`preset-pill ${selectedPlugin.id === p.id ? 'active' : ''}`}
              onClick={() => handleApplyPreset(p)}
            >
              <strong>{p.name}</strong>
            </button>
          ))}
        </div>
      </div>

      {/* Mode Tabs */}
      <div className="ast-tabs-bar">
        <button
          type="button"
          className={`ast-tab ${activeTab === 'ast-tree' ? 'active' : ''}`}
          onClick={() => setActiveTab('ast-tree')}
        >
          🌳 Live AST Tree Explorer
        </button>
        <button
          type="button"
          className={`ast-tab ${activeTab === 'plugin-sandbox' ? 'active' : ''}`}
          onClick={() => setActiveTab('plugin-sandbox')}
        >
          ⚙️ Babel Plugin Transformer Sandbox
        </button>
        <button
          type="button"
          className={`ast-tab ${activeTab === 'compiler-guide' ? 'active' : ''}`}
          onClick={() => setActiveTab('compiler-guide')}
        >
          📖 4-Phase Compiler Architecture Guide
        </button>
      </div>

      {/* 1. AST TREE EXPLORER TAB */}
      {activeTab === 'ast-tree' && (
        <div className="ast-main-grid">
          {/* Left Column: Source Code Editor */}
          <div className="source-column">
            <div className="source-card">
              <div className="card-header-row">
                <span className="editor-lang-tag">JavaScript / JSX Source</span>
                <span className="live-indicator">● AST Live Synced</span>
              </div>
              <textarea
                className="source-textarea"
                value={sourceCode}
                onChange={e => setSourceCode(e.target.value)}
                rows={18}
                spellCheck={false}
              />
            </div>
          </div>

          {/* Right Column: AST Visualizer */}
          <div className="ast-tree-column">
            <div className="ast-tree-card">
              <div className="card-header-row">
                <span className="tree-header-title">Abstract Syntax Tree (AST Hierarchy)</span>
                <span className="node-count-badge">Type: Program</span>
              </div>

              <div className="tree-scroll-container">
                {renderASTTree(parsedAST, 'root', 0)}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. PLUGIN SANDBOX TAB */}
      {activeTab === 'plugin-sandbox' && (
        <div className="sandbox-grid">
          {/* Column 1: Input Code */}
          <div className="sandbox-card">
            <div className="sandbox-header">
              <span className="col-tag">1. Input JavaScript</span>
            </div>
            <pre className="code-box">
              <code>{selectedPlugin.sampleInput}</code>
            </pre>
          </div>

          {/* Column 2: Babel Plugin Visitor */}
          <div className="sandbox-card highlight-plugin">
            <div className="sandbox-header">
              <span className="col-tag plugin-tag">2. Babel AST Visitor Plugin</span>
            </div>
            <pre className="code-box">
              <code>{selectedPlugin.pluginCode}</code>
            </pre>
          </div>

          {/* Column 3: Transpiled Output */}
          <div className="sandbox-card">
            <div className="sandbox-header">
              <span className="col-tag output-tag">3. Transpiled Output</span>
            </div>
            <pre className="code-box output-box">
              <code>{selectedPlugin.transformedOutput}</code>
            </pre>
          </div>
        </div>
      )}

      {/* 3. COMPILER GUIDE TAB */}
      {activeTab === 'compiler-guide' && (
        <div className="guide-container">
          <div className="guide-intro-banner">
            <h3>How Modern Frontend Compilers Work (Babel, SWC, ESBuild)</h3>
            <p>
              Every JavaScript and TypeScript compiler processes code through four distinct, deterministic phases:
            </p>
          </div>

          <div className="phases-grid">
            <div className="phase-card">
              <span className="phase-num">Phase 1</span>
              <h4>Lexical Analysis (Tokenizer)</h4>
              <p>Converts raw source code text characters into discrete tokens (e.g. <code>const</code>, <code>sum</code>, <code>=</code>, <code>10</code>, <code>;</code>).</p>
            </div>

            <div className="phase-card">
              <span className="phase-num">Phase 2</span>
              <h4>Syntactic Analysis (Parser)</h4>
              <p>Constructs the nested <strong>Abstract Syntax Tree (AST)</strong> according to JavaScript grammar rules, verifying syntax correctness.</p>
            </div>

            <div className="phase-card">
              <span className="phase-num">Phase 3</span>
              <h4>Transformation (AST Visitor)</h4>
              <p>Traverses AST nodes using the Visitor Pattern. Custom Babel / ESLint plugins inspect, mutate, replace, or remove nodes.</p>
            </div>

            <div className="phase-card">
              <span className="phase-num">Phase 4</span>
              <h4>Code Generation (Emitter)</h4>
              <p>Walks the transformed AST and emits stringified, optimized target JavaScript with source maps for debugging.</p>
            </div>
          </div>
        </div>
      )}

      {/* Footer Navigation */}
      <div className="ast-footer">
        <Link to="/case-studies" className="btn btn-secondary">
          📐 FAANG Architecture Case Studies
        </Link>
        <Link to="/profiler" className="btn btn-primary">
          ⚡ Web Vitals Profiler Lab →
        </Link>
      </div>
    </div>
  )
}
