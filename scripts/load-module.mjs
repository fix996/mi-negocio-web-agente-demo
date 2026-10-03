import { readFileSync } from 'node:fs';
import ts from 'typescript';

// Test the actual TypeScript domain modules without a browser or compiled test fixtures.
export function moduleUrl(url) {
  const source = readFileSync(url, 'utf8');
  let { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  outputText = outputText.replace(/from ['"](\.[^'"]+)['"]/g, (_, relative) => {
    const dependency = new URL(
      relative.endsWith('.ts') ? relative : relative + '.ts',
      url,
    );
    return 'from ' + JSON.stringify(moduleUrl(dependency));
  });
  return (
    'data:text/javascript;base64,' + Buffer.from(outputText).toString('base64')
  );
}
