#!/usr/bin/env node
'use strict';

const fs = require('node:fs');
const path = require('node:path');

const scriptId = process.argv[2] || process.env.APPS_SCRIPT_ID;
if (!scriptId || !/^[A-Za-z0-9_-]{20,}$/.test(scriptId)) {
  console.error('使い方: npm run setup:clasp -- <Apps ScriptのスクリプトID>');
  console.error('または環境変数 APPS_SCRIPT_ID を設定してください。');
  process.exit(1);
}

const configPath = path.join(process.cwd(), '.clasp.json');
if (fs.existsSync(configPath)) {
  console.error('.clasp.json はすでにあります。既存の設定を確認してから手動で更新してください。');
  process.exit(1);
}

const config = { scriptId, rootDir: '.' };
fs.writeFileSync(configPath, JSON.stringify(config, null, 2) + '\n', { flag: 'wx' });
console.log('.clasp.json を作成しました。このファイルは .gitignore 対象です。');
console.log('次に npm run login を実行し、Googleアカウントで認証してください。');
