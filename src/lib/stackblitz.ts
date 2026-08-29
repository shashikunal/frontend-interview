export function openInStackBlitz(code: string) {
  const form = document.createElement('form');
  form.method = 'POST';
  form.target = '_blank';
  form.action = 'https://stackblitz.com/run';

  const prepareProject = () => ({
    files: {
      'index.html': `<div id="root"></div>`,
      'src/main.tsx': `
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`,
      'src/App.tsx': code,
      'src/App.css': 'body { font-family: sans-serif; padding: 20px; }',
    },
    template: 'node',
    dependencies: {
      react: '^19.0.0',
      'react-dom': '^19.0.0',
    },
  });

  const project = prepareProject();
  const json = JSON.stringify(project);
  const input = document.createElement('input');
  input.type = 'hidden';
  input.name = 'project';
  input.value = json;
  form.appendChild(input);
  document.body.appendChild(form);
  form.submit();
  document.body.removeChild(form);
}
