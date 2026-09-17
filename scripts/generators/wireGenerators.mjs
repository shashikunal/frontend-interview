// scripts/generators/wireGenerators.mjs
// Wires all 12 generator files to use generatorFactory, standardAngles, and curated topic files

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SUBJECT_CONFIGS = [
  { file: 'htmlGenerator.mjs', fn: 'generateHtmlQuestion', id: 'html', name: 'HTML', topicFile: 'htmlTopics.mjs', varName: 'HTML_TOPICS' },
  { file: 'cssGenerator.mjs', fn: 'generateCssQuestion', id: 'css', name: 'CSS', topicFile: 'cssTopics.mjs', varName: 'CSS_TOPICS' },
  { file: 'jsGenerator.mjs', fn: 'generateJavascriptQuestion', id: 'javascript', name: 'JavaScript', topicFile: 'jsTopics.mjs', varName: 'JS_TOPICS' },
  { file: 'es6Generator.mjs', fn: 'generateEs6Question', id: 'es6', name: 'ES6', topicFile: 'es6Topics.mjs', varName: 'ES6_TOPICS' },
  { file: 'es7Generator.mjs', fn: 'generateEs7Question', id: 'es7', name: 'ES7', topicFile: 'es7Topics.mjs', varName: 'ES7_TOPICS' },
  { file: 'es8Generator.mjs', fn: 'generateEs8Question', id: 'es8', name: 'ES8', topicFile: 'es8Topics.mjs', varName: 'ES8_TOPICS' },
  { file: 'domGenerator.mjs', fn: 'generateDomQuestion', id: 'dom', name: 'DOM', topicFile: 'domTopics.mjs', varName: 'DOM_TOPICS' },
  { file: 'bomGenerator.mjs', fn: 'generateBomQuestion', id: 'bom', name: 'BOM', topicFile: 'bomTopics.mjs', varName: 'BOM_TOPICS' },
  { file: 'webApisGenerator.mjs', fn: 'generateWebApisQuestion', id: 'web-apis', name: 'Web APIs', topicFile: 'webApisTopics.mjs', varName: 'WEB_APIS_TOPICS' },
  { file: 'typescriptGenerator.mjs', fn: 'generateTypescriptQuestion', id: 'typescript', name: 'TypeScript', topicFile: 'typescriptTopics.mjs', varName: 'TYPESCRIPT_TOPICS' },
  { file: 'reactGenerator.mjs', fn: 'generateReactQuestion', id: 'react', name: 'React', topicFile: 'reactTopics.mjs', varName: 'REACT_TOPICS' },
  { file: 'reduxGenerator.mjs', fn: 'generateReduxQuestion', id: 'redux', name: 'Redux', topicFile: 'reduxTopics.mjs', varName: 'REDUX_TOPICS' },
];

for (const cfg of SUBJECT_CONFIGS) {
  const content = `// scripts/generators/${cfg.file}
// 100% Domain-Pure Question Generator for ${cfg.name} (Zero Duplicates, Fresher-First)

import { createSubjectGenerator } from './generatorFactory.mjs';
import { getStandardAngles } from './standardAngles.mjs';
import { ${cfg.varName} } from './topics/${cfg.topicFile}';

const angles = getStandardAngles('${cfg.name}');

export const ${cfg.fn} = createSubjectGenerator({
  subjectId: '${cfg.id}',
  defaultSubjectName: '${cfg.name}',
  topics: ${cfg.varName},
  angles,
});
`;

  fs.writeFileSync(path.join(__dirname, cfg.file), content, 'utf-8');
  console.log(`✅ Wrote generator: ${cfg.file}`);
}

console.log('🎉 All 12 subject generators wired successfully!');
