# Google Apps Script と GitHub の連携

このリポジトリの `Code.gs`、`index.html`、`appsscript.json` を、Google公式の `clasp` CLIでApps Scriptプロジェクトに同期します。認証情報やスクリプトIDはGitHubへコミットしません。

## 初回セットアップ

1. Google Apps Scriptで対象プロジェクトを開き、**プロジェクトの設定 → スクリプトID**をコピーします。同期先のプロジェクトに既存コードがある場合、最初にバックアップを取ってください。
2. Node.jsをインストールし、このリポジトリをローカルにクローンします。
3. リポジトリのルートで次を実行します。

```bash
npm install
npm run setup:clasp -- "ここにスクリプトID"
npm run login
```

4. `clasp push` はApps Script側の同名ファイルを更新します。既存の内容と同期先を確認してから実行してください。

```bash
npm run push
```

## 以後の同期

- Apps Scriptからローカルへ取得: `npm run pull`
- ローカルからApps Scriptへ反映: `npm run push`
- Apps Scriptプロジェクトをブラウザーで開く: `npm run open`
- バージョンを作成してデプロイ: `npm run deploy`

ウェブアプリとして公開・更新する場合は、Apps Script画面の **デプロイ → 新しいデプロイ / デプロイを管理** でウェブアプリの実行ユーザーとアクセス範囲を確認してください。`clasp deploy` はバージョン付きデプロイを作りますが、公開範囲の選択や必要な権限の承認は別途確認が必要です。Drive保存を使う場合、初回に必要な権限を��認してください。

## セキュリティ

- `.clasp.json` はローカルに作られ、`.gitignore` で除外されます。コミットしないでください。
- claspのログイン情報やアクセストークンを、リポジトリやチャットへ貼らないでください。
- `npm run setup:clasp` は既存の `.clasp.json` を上書きしません。同期先を切り替える場合は、ファイルの内容を確認して手動で変更してください。
