// Bundles src/ into one self-contained index.html.  Usage: node build.mjs [extra-output-without-html-shell]
import { readFileSync, writeFileSync } from 'node:fs';
const r = f => readFileSync(new URL('./src/' + f, import.meta.url), 'utf8');
const page = `<title>Phûut Thai</title>
<meta name="claude:viewport-fit-sides" content="cover">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,600..800&family=Inter:wght@400..700&display=swap">
<style>
${r('app.css')}</style>
<div id="app"></div>
<script>
${r('content.js')}
${r('app.js')}</script>
`;
const full = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-title" content="Phûut Thai">
<meta name="theme-color" content="#0C6F66">
<style>:root{padding:env(safe-area-inset-top,0px) 0 env(safe-area-inset-bottom,0px);box-sizing:border-box}[hidden]{display:none!important}</style>
</head>
<body>
${page}</body>
</html>
`;
writeFileSync(new URL('./index.html', import.meta.url), full);
if (process.argv[2]) writeFileSync(process.argv[2], page);
console.log('built index.html', (full.length / 1024).toFixed(0) + ' KB');
