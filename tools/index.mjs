import fs from 'fs';

const template = './src/index.html';
const html = fs.readFileSync(template, { encoding: 'utf-8'});
const content = html.replace(/\{TIMESTAMP\}/g, Date.now());

fs.writeFileSync('./index.html', content, 'utf-8');
