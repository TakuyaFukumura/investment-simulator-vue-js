# Vuetify 3 から Vuetify 4 への移行仕様書

## 1. 概要

本ドキュメントは、`investment-simulator-vue-js` プロジェクトで使用している Vuetify 3 を Vuetify 4 へ移行するための仕様を整理したものです。
公式アップグレードガイド（https://vuetifyjs.com/ja/getting-started/upgrade-guide/ ）を参考に、本プロジェクト固有の変更点を洗い出します。

---

## 2. 移行の目的

- Vuetify 4 の新機能・改善されたパフォーマンスを享受する
- 長期的なメンテナンス性を確保する（Vuetify 3 のサポート終了に備える）
- より厳格な TypeScript 型定義による開発体験の向上

---

## 3. 前提条件

Vuetify 4 への移行には、以下のバージョン要件を満たす必要があります。

| 依存関係 | 現在のバージョン | 必要バージョン |
|---|---|---|
| Node.js | 20.x（CI: `.github/workflows/ci.yml` の `node-version: '20'`） | 20.x 以上 |
| TypeScript | `~6.0.2` | 5.0 以上（現状は満足） |
| Vue | `^3.5.32` | 3.5 以上（現状は満足） |
| Vite | `^8.0.4` | 5.0 以上（現状は満足） |

---

## 4. 現状の整理

### 4.1 現在の依存パッケージ（`package.json` 抜粋）

```json
"dependencies": {
  "vuetify": "^3.12.5"
}
```

### 4.2 現在の Vuetify セットアップ（`src/main.ts`）

```typescript
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'

const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: 'dark',
        themes: {
            dark: {
                dark: true,
                colors: { ... },
            },
        },
    },
})
```

### 4.3 使用している Vuetify コンポーネント一覧

| コンポーネント | 使用ファイル |
|---|---|
| `v-app` | `App.vue` |
| `v-main` | `App.vue` |
| `v-container` | `App.vue` |
| `v-row` / `v-col` | `App.vue`, `InputForm.vue`, `ResultSummary.vue` |
| `v-icon` | `App.vue`, `InputForm.vue`, `ResultSummary.vue`, `GrowthChart.vue`, `YearlyTable.vue` |
| `v-card` / `v-card-title` / `v-card-text` / `v-card-actions` | `InputForm.vue`, `ResultSummary.vue`, `GrowthChart.vue`, `YearlyTable.vue` |
| `v-text-field` | `InputForm.vue` |
| `v-btn-toggle` | `InputForm.vue` |
| `v-btn` | `InputForm.vue` |
| `v-table` | `YearlyTable.vue` |

---

## 5. 主な変更点

### 5.1 パッケージのアップデート

`package.json` の `vuetify` を Vuetify 4 へ更新します。

```diff
-  "vuetify": "^3.12.5"
+  "vuetify": "^4.0.0"
```

また、Vuetify 4 では Vite との連携に `vite-plugin-vuetify` を利用することが推奨されます。

```diff
+  "vite-plugin-vuetify": "^2.0.0"   // devDependencies に追加
```

### 5.2 `createVuetify()` の設定変更（`src/main.ts`）

#### 5.2.1 コンポーネント・ディレクティブのインポート方法

Vuetify 4 では、`vite-plugin-vuetify` を使ったツリーシェイキングが推奨されます。
`* as components` / `* as directives` の全量インポートは不要になります。

```diff
- import * as components from 'vuetify/components'
- import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
-   components,
-   directives,
    theme: { ... },
})
```

`vite.config.ts` に Vuetify プラグインを追加します。

```diff
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
+ import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    plugins: [
        vue(),
+       vuetify({ autoImport: true }),
    ],
})
```

#### 5.2.2 テーマ設定の変更

Vuetify 4 では、`themes` 内の各テーマオブジェクトの `dark` プロパティが廃止されています。
代わりに `ThemeDefinition` の `dark` フラグは引き続きサポートされますが、記法が変わる可能性があります。
公式アップグレードガイドに従い、以下の点を確認・修正する必要があります。

```diff
themes: {
    dark: {
-       dark: true,
        colors: {
            primary: '#5C6BC0',
            secondary: '#7E57C2',
            accent: '#42A5F5',
            background: '#0D1117',
            surface: '#161B22',
            'surface-variant': '#1E2430',
        },
    },
},
```

> **注意**: Vuetify 4 では `accent` カラーが標準テーマから削除される可能性があります。
> `GrowthChart.vue` や `ResultSummary.vue` で `color="accent"` を使用しているため、
> カスタムカラーとして定義し続けるか、別のカラーに変更する必要があります。

### 5.3 コンポーネント API の変更

Vuetify 4 では一部のコンポーネント Props・イベント名が変更されています。
以下は本プロジェクトへの影響が想定される変更点です。

#### 5.3.1 `v-btn-toggle`（`InputForm.vue`）

`v-btn-toggle` の `mandatory` prop の扱いが変わる可能性があります。
公式ガイドに従い動作確認が必要です。

```html
<!-- 現在の記述 -->
<v-btn-toggle
    v-model="form.interestType"
    color="primary"
    density="comfortable"
    mandatory
    rounded="lg"
>
```

#### 5.3.2 `v-text-field` の `variant` prop（`InputForm.vue`）

`variant="outlined"` は Vuetify 4 でも継続サポートされる見込みですが、
デフォルト値が変更になる場合があるため確認が必要です。

#### 5.3.3 `v-table`（`YearlyTable.vue`）

`v-table` コンポーネントは Vuetify 4 でも継続されますが、内部的なクラス名や
CSS 変数が変わる可能性があり、カスタムスタイル（`<style scoped>`）の動作確認が必要です。

### 5.4 CSS 変数・スタイルの変更

Vuetify 4 では CSS カスタムプロパティの命名規則が変更されることがあります。
`src/style.css` や各コンポーネントでインラインスタイルに使用している値の互換性確認が必要です。

---

## 6. 変更対象ファイル一覧

| ファイル | 変更の種類 | 変更内容の概要 |
|---|---|---|
| `package.json` | 修正 | `vuetify` バージョンを `^4.0.0` へ更新、`vite-plugin-vuetify` を追加 |
| `vite.config.ts` | 修正 | `vite-plugin-vuetify` プラグインを追加 |
| `src/main.ts` | 修正 | `components` / `directives` の全量インポートを削除、テーマ定義を調整 |
| `src/components/InputForm.vue` | 確認・修正 | `v-btn-toggle` の `mandatory` prop、`v-text-field` の動作確認 |
| `src/components/ResultSummary.vue` | 確認・修正 | `color="accent"` の対応確認 |
| `src/components/GrowthChart.vue` | 確認・修正 | `color="accent"` の対応確認 |
| `src/components/YearlyTable.vue` | 確認・修正 | `v-table` 関連のスタイル調整 |

---

## 7. 移行手順

以下の手順で移行を進めることを推奨します。

### Step 1: ブランチ作成

```bash
git checkout -b feature/vuetify-v4-migration
```

### Step 2: パッケージのアップデート

```bash
npm install vuetify@^4.0.0
npm install --save-dev vite-plugin-vuetify@^2.0.0
```

### Step 3: `vite.config.ts` の修正

`vite-plugin-vuetify` を追加します（詳細は [5.2.1](#521-コンポーネントディレクティブのインポート方法) 参照）。

### Step 4: `src/main.ts` の修正

`createVuetify()` の設定を Vuetify 4 の仕様に合わせて修正します（詳細は [5.2](#52-createvuetify-の設定変更srcmaints) 参照）。

### Step 5: 動作確認・修正

```bash
npm run dev
```

ブラウザで各コンポーネントの表示・動作を確認し、崩れている箇所を修正します。

### Step 6: ビルド確認

```bash
npm run build
```

ビルドエラーが出ないことを確認します。

---

## 8. 参考リンク

- [Vuetify 公式アップグレードガイド（日本語）](https://vuetifyjs.com/ja/getting-started/upgrade-guide/)
- [Vuetify MCP を使ったクイックスタート](https://vuetifyjs.com/ja/getting-started/upgrade-guide/#quick-start-with-vuetify-mcp)
- [vite-plugin-vuetify](https://github.com/vuetifyjs/vuetify-loader/tree/master/packages/vite-plugin)
- [Vuetify 4 リリースノート](https://github.com/vuetifyjs/vuetify/releases)

---

## 9. 注意事項・リスク

| リスク | 対応策 |
|---|---|
| 移行時点でリリースが安定版でない場合、本番利用には注意が必要 | 移行前にリリースノートで安定版かどうかを確認してから作業を進める |
| 移行時点のテーマ仕様で `accent` カラーが利用できない場合、複数コンポーネントのデザインに影響が出る | リリースノートとテーマ仕様を確認し、カスタムカラー定義を継続するか、`primary` / `secondary` に統一する |
| `vite-plugin-vuetify` のオートインポートが期待通りに動作しない場合 | 必要なコンポーネントを `createVuetify({ components })` で明示的に登録する |
| CSS 変数・スコープ付きスタイルの破壊的変更 | `npm run dev` で全画面を目視確認し、スタイルを修正する |
