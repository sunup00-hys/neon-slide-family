// Static inline-script syntax and duplicate-ID check. Does not claim browser/runtime success.
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
const files = ['index.html', 'stairs-preview.html'];
let failures = 0;
for (const file of files) {
  const html = readFileSync(file, 'utf8');
  const ids = [...html.matchAll(/\bid=["']([^"']+)["']/g)].map(m => m[1]);
  const duplicateIds = [...new Set(ids.filter((id, i) => ids.indexOf(id) !== i))];
  if (duplicateIds.length) { console.error(file, 'duplicate IDs:', duplicateIds.join(', ')); failures++; }
  const scripts = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script\s*>/gi)];
  let checked = 0;
  for (const [i, match] of scripts.entries()) {
    const attrs = match[1], source = match[2];
    if (/\bsrc\s*=/.test(attrs) || /\btype\s*=\s*["'](?:application\/json|importmap)["']/i.test(attrs) || !source.trim()) continue;
    if (/\btype\s*=\s*["']module["']/i.test(attrs)) {
      console.log(file, 'module script', i + 1, 'skipped (requires module parser)');
      continue;
    }
    try { new vm.Script(source, { filename: file + ':inline-script-' + (i + 1) }); checked++; }
    catch (error) { console.error(error.message); failures++; }
  }
  if (file === 'stairs-preview.html') {
    const requiredIds = ['duelDialog', 'duelClose', 'duelBody', 'duelMessage', 'familyProfileDialog', 'familyProfileClose', 'recordDialog', 'recordClose', 'wardrobeStars'];
    const missing = requiredIds.filter(id => !ids.includes(id));
    if (missing.length) { console.error(file, 'missing required UI IDs:', missing.join(', ')); failures++; }
    const duelScript = scripts.find(m => m[1].includes('data-stairs-duel-v1'))?.[2] ?? '';
    const requiredDuelHooks = ['duelAccept', 'duelDecline', 'duelCancel', 'duelUser', 'duelDifficulty'];
    const missingHooks = requiredDuelHooks.filter(hook => !duelScript.includes(hook));
    if (missingHooks.length) { console.error(file, 'missing duel UI hooks:', missingHooks.join(', ')); failures++; }
    console.log(file + ': duel modal required IDs and hooks checked');
  }
  console.log(file + ': checked ' + checked + ' classic scripts; duplicate IDs ' + duplicateIds.length);
}
if (failures) process.exitCode = 1;
