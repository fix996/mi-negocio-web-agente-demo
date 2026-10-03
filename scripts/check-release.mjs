import { readFileSync, readdirSync, statSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { gzipSync } from 'node:zlib';

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const path = dir + '/' + name;
    return statSync(path).isDirectory() ? walk(path) : [path];
  });
}
const sources = ['app', 'components', 'hooks', 'lib'].flatMap(walk);
const published = walk('docs');
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(Boolean);
const failures = [];
const secretPatterns = [
  /-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----/,
  /\bgh[pousr]_[A-Za-z0-9]{30,}\b/,
  /\bgithub_pat_[A-Za-z0-9_]{40,}\b/,
  /\bAKIA[A-Z0-9]{16}\b/,
  /\bsk-(?:proj-|svcacct-)?[A-Za-z0-9_-]{32,}\b/,
  /(?:password|api[_-]?key|client[_-]?secret)\s*[:=]\s*["'][^"'\s]{8,}["']/i,
];
for (const file of [...sources, ...published]) {
  if (!/\.(tsx?|m?js|css|html|json|txt)$/.test(file)) continue;
  const content = readFileSync(file, 'utf8');
  if (secretPatterns.some((pattern) => pattern.test(content)))
    failures.push(`${file}: posible secreto; revisar sin imprimir su valor`);
  if (file.endsWith('.tsx') && /type=["']password["']/.test(content))
    failures.push(`${file}: esta demo no debe solicitar contraseñas`);
}
for (const file of [...tracked, ...published]) {
  if (/(^|\/)(\.env(?:\.|$)|node_modules\/|.*\.(?:pem|key|p12)$)/i.test(file))
    failures.push(`${file}: archivo privado o innecesario`);
}
for (const extension of ['js', 'css']) {
  const files = published.filter((file) => file.endsWith('.' + extension));
  const bytes = files.reduce((sum, file) => sum + statSync(file).size, 0);
  const gzip = files.reduce(
    (sum, file) => sum + gzipSync(readFileSync(file)).length,
    0,
  );
  const budget = extension === 'js' ? 100_000 : 10_000;
  console.log(
    `${extension.toUpperCase()}: ${bytes} bytes; gzip local ${gzip} bytes; presupuesto ${budget}`,
  );
  if (gzip > budget)
    failures.push(
      `${extension}: supera el presupuesto gzip; investigar antes de publicar`,
    );
}
const sizes = sources.map((file) => ({
  file,
  lines: readFileSync(file, 'utf8').trimEnd().split('\n').length,
}));
console.log(
  'Archivos fuente más extensos (se revisa responsabilidad, no solo líneas):',
);
console.table(sizes.sort((a, b) => b.lines - a.lines).slice(0, 5));
if (failures.length) {
  console.error(failures.join('\n'));
  process.exitCode = 1;
} else
  console.log(
    `Controles de entrega aprobados: ${sources.length} fuentes y ${published.length} archivos públicos. Búsqueda de patrones comunes; no auditoría exhaustiva.`,
  );
