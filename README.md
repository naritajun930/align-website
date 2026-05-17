# ALIGN Personal Gym — Website

## 構成

```
align-website/
├── index.html          ← トップページ（後で追加）
├── netlify.toml        ← Netlify設定
├── .gitignore
├── .env.example        ← microCMS APIキーのテンプレート
├── assets/
│   ├── css/
│   │   └── blog.css
│   ├── js/
│   │   └── microcms.js ← microCMS APIクライアント
│   └── images/
└── blog/
    ├── index.html      ← ブログ一覧
    └── post.html       ← 記事詳細
```

## セットアップ

### 1. microCMS

1. [microCMS](https://microcms.io/) でサービスを作成
2. API名 `blog` でコンテンツAPIを作成
3. フィールド：`title`（テキスト）/ `content`（リッチエディタ）/ `eyecatch`（画像）/ `category`（コンテンツ参照）
4. `assets/js/microcms.js` の以下2行を書き換える

```js
const MICROCMS_SERVICE_DOMAIN = 'your-service-domain'; // ←変更
const MICROCMS_API_KEY = 'your-api-key';               // ←変更
```

### 2. Netlify

1. GitHubにリポジトリを作成してプッシュ
2. Netlify で「Import from Git」
3. Build command: （空欄）/ Publish directory: `.`
4. Deploy

## ローカル確認

Live Server（VS Code拡張）または：

```bash
npx serve .
```
