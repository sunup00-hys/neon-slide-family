// npm install --no-save --prefix /tmp/egg-build three@0.187.0 esbuild@0.28.0
// EGG_BUILD_NODE_MODULES=/tmp/egg-build/node_modules node scripts/build-egg.mjs
import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import path from 'node:path';
const root=path.resolve(import.meta.dirname,'..');
const modules=path.resolve(process.env.EGG_BUILD_NODE_MODULES||path.join(root,'node_modules'));
const require=createRequire(path.join(modules,'egg-builder.cjs'));
const {build}=require('esbuild');
const three=path.join(path.dirname(require.resolve('three')),'three.module.js');
const source=await readFile(path.join(root,'src/egg-heist.source.html'),'utf8');
const match=source.match(/<script type="module">([\s\S]*?)<\/script>/);
if(!match)throw Error('Missing game module');
const contents=match[1].replace("'./vendor/three.module.js'",JSON.stringify(three));
const result=await build({stdin:{contents,resolveDir:root,loader:'js'},bundle:true,minify:true,format:'esm',write:false,legalComments:'inline'});
const script=result.outputFiles[0].text.replaceAll('</script','<\\/script');
await writeFile(path.join(root,'egg-heist.html'),source.replace(match[0],()=>`<script type="module">${script}</script>`));
console.log('Built standalone egg-heist.html');
