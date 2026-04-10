# リファクタリング検討

## 1. 概要

本ドキュメントは、`investment-simulator-vue-js` プロジェクトのコードを調査し、改善できそうな点をまとめたものです。

---

## 2. 改善点一覧

| # | 対象ファイル | 改善の種類 | 概要 |
|---|---|---|---|
| 1 | `ResultSummary.vue`, `YearlyTable.vue` | 重複コードの削除 | `formatCurrency` 関数の共通化 |
| 2 | `GrowthChart.vue` | パフォーマンス改善 | `chartOptions` の `computed` を `const` に変更 |
| 3 | `main.ts` | バンドルサイズ削減 | Vuetify コンポーネントの全量インポートをツリーシェイキング対応に変更 |
| 4 | 複数ファイル | 保守性向上 | ハードコードされた色値の一元管理 |
| 5 | `App.vue`, `ResultSummary.vue`, `InputForm.vue`, `YearlyTable.vue` | 保守性向上 | インラインスタイルの CSS クラス化 |
| 6 | `YearlyTable.vue` | バグ修正 | スコープ付きスタイルのテーブルヘッダー背景色がテーマと不整合 |

---

## 3. 各改善点の詳細

### 3.1 `formatCurrency` 関数の共通化

#### 現状

`formatCurrency` 関数が `ResultSummary.vue` と `YearlyTable.vue` の両方にまったく同じ実装で存在しています。

```typescript
// ResultSummary.vue（6〜13行目）
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value)
}

// YearlyTable.vue（6〜13行目）— 上と同一
function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value)
}
```

#### 問題点

- 同一のロジックが 2 か所に存在するため、仕様変更時に両方を修正する必要がある
- 修正漏れが発生しやすく、バグの温床になりうる

#### 改善案

`src/composables/useFormatCurrency.ts`（または `src/utils/formatCurrency.ts`）としてユーティリティ関数を切り出し、両コンポーネントからインポートして使用する。

```typescript
// src/utils/formatCurrency.ts
export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value)
}
```

```typescript
// ResultSummary.vue / YearlyTable.vue（インポートして使用）
import { formatCurrency } from '../utils/formatCurrency'
```

---

### 3.2 `chartOptions` の `computed` を `const` に変更

#### 現状

`GrowthChart.vue` の `chartOptions` は `computed` で定義されています。

```typescript
// GrowthChart.vue（59〜107行目）
const chartOptions = computed(() => ({
  responsive: true,
  // ...
}))
```

#### 問題点

`chartOptions` の内容はリアクティブな依存関係（`store` や `ref` など）を持っていません。
Vue の `computed` は依存関係が変化したときに再計算されますが、依存関係がない場合は初回のみ計算されます。
それでも `computed` の仕組みを使うことでオーバーヘッドが生じ、コードの意図が伝わりにくくなります。

#### 改善案

`computed` を通常の定数（`const`）に変更する。

```typescript
// GrowthChart.vue
const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  // ...（以降は変更なし）
}
```

> **注意**: ただし、将来的に `chartOptions` の一部を動的（例: ロケールに応じたラベル変更）にする予定がある場合は、引き続き `computed` のままにしておくほうが拡張しやすい。

---

### 3.3 Vuetify コンポーネントの全量インポートをツリーシェイキング対応に変更

#### 現状

`src/main.ts` で Vuetify のコンポーネントとディレクティブをすべてインポートしています。

```typescript
// src/main.ts（4〜5行目）
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
    // ...
})
```

#### 問題点

- 使用していないコンポーネント・ディレクティブまでバンドルに含まれるため、最終的なビルドサイズが不必要に大きくなる
- 本プロジェクトで実際に使用しているコンポーネントは限られている（`v-app`, `v-main`, `v-container`, `v-row`, `v-col`, `v-icon`, `v-card` 系, `v-text-field`, `v-btn-toggle`, `v-btn`, `v-table`）

#### 改善案

`vite-plugin-vuetify` を利用したオートインポートへの移行、または使用しているコンポーネントだけを明示的にインポートする。

**案 A: `vite-plugin-vuetify` によるオートインポート**

```bash
npm install --save-dev vite-plugin-vuetify
```

```typescript
// vite.config.ts
import vue from '@vitejs/plugin-vue'
import vuetify from 'vite-plugin-vuetify'

export default defineConfig({
    plugins: [
        vue(),
        vuetify({ autoImport: true }),
    ],
})
```

```typescript
// src/main.ts — components / directives の行を削除
const vuetify = createVuetify({
    theme: { ... },
})
```

**案 B: 使用コンポーネントの明示的なインポート**

```typescript
// src/main.ts
import {
    VApp, VMain, VContainer, VRow, VCol,
    VIcon, VCard, VCardTitle, VCardText, VCardActions,
    VTextField, VBtnToggle, VBtn, VTable,
} from 'vuetify/components'
import { Ripple } from 'vuetify/directives'

const vuetify = createVuetify({
    components: { VApp, VMain, VContainer, /* ... */ },
    directives: { Ripple },
    theme: { ... },
})
```

> **備考**: Vuetify v4 への移行時はこの対応が必須となる（既存の `vuetify-migration-v3-to-v4.md` も参照）。

---

### 3.4 ハードコードされた色値の一元管理

#### 現状

テーマカラーに対応する色の 16 進数値が複数ファイルに直接書かれています。

| 色コード | 使用箇所 |
|---|---|
| `#42A5F5`（`accent`） | `GrowthChart.vue`, `ResultSummary.vue`, `YearlyTable.vue` |
| `#5C6BC0`（`primary`） | `GrowthChart.vue`, `ResultSummary.vue`, `style.css`, `InputForm.vue` |
| `#7E57C2`（`secondary`） | `ResultSummary.vue`, `YearlyTable.vue` |
| `#0D1117`（`background`） | `App.vue`, `style.css` |
| `#1E2430`（`surface-variant`） | `GrowthChart.vue` |
| `#161B22`（`surface`） | ※テーマ定義のみ |

#### 問題点

- テーマカラーを変更する際に複数ファイルを修正する必要がある
- テーマ定義と実際の使用値が乖離した場合に気づきにくい

#### 改善案

色定数を `src/constants/colors.ts` にまとめて管理し、テーマ設定・コンポーネント双方から参照する。

```typescript
// src/constants/colors.ts
export const COLORS = {
    primary:        '#5C6BC0',
    secondary:      '#7E57C2',
    accent:         '#42A5F5',
    background:     '#0D1117',
    surface:        '#161B22',
    surfaceVariant: '#1E2430',
} as const
```

```typescript
// src/main.ts
import { COLORS } from './constants/colors'

const vuetify = createVuetify({
    theme: {
        themes: {
            dark: {
                colors: {
                    primary:           COLORS.primary,
                    secondary:         COLORS.secondary,
                    accent:            COLORS.accent,
                    background:        COLORS.background,
                    surface:           COLORS.surface,
                    'surface-variant': COLORS.surfaceVariant,
                },
            },
        },
    },
})
```

```typescript
// GrowthChart.vue（borderColor などで使用）
import { COLORS } from '../constants/colors'

datasets: [
  {
    label: '評価額',
    borderColor: COLORS.accent,
    backgroundColor: 'rgba(66, 165, 245, 0.1)',
    // ...
  },
  // ...
]
```

---

### 3.5 インラインスタイルの CSS クラス化

#### 現状

複数のコンポーネントでインラインスタイルが多用されています。

```html
<!-- App.vue -->
<v-main style="background: #0D1117">

<!-- ResultSummary.vue -->
<div style="background: rgba(92, 107, 192, 0.12); border: 1px solid rgba(92, 107, 192, 0.3)">
<div class="text-h6 font-weight-bold" style="color: #42A5F5">

<!-- InputForm.vue -->
<v-btn :style="{ background: 'linear-gradient(135deg, #5C6BC0, #42A5F5)' }">

<!-- YearlyTable.vue -->
<td style="color: #42A5F5">
<td style="color: #7E57C2">
```

#### 問題点

- スタイルが HTML テンプレートに埋め込まれているため視認性が下がる
- 同じスタイルが複数箇所で繰り返され、修正コストが高い

#### 改善案

インラインスタイルを `<style scoped>` ブロックの CSS クラスとして定義する。
テーマカラーを使用する箇所は Vuetify のユーティリティクラス（`text-primary`, `text-accent`, `bg-surface` など）を活用する。

```html
<!-- ResultSummary.vue -->
<div class="result-card pa-4 rounded-lg text-center result-card--primary">
  <div class="text-caption text-medium-emphasis mb-1">総投資額</div>
  <div class="text-h6 font-weight-bold text-primary">...</div>
</div>
```

```css
/* ResultSummary.vue <style scoped> */
.result-card--primary {
  background: rgba(92, 107, 192, 0.12);
  border: 1px solid rgba(92, 107, 192, 0.3);
}
.result-card--accent {
  background: rgba(66, 165, 245, 0.12);
  border: 1px solid rgba(66, 165, 245, 0.3);
}
.result-card--secondary {
  background: rgba(126, 87, 194, 0.12);
  border: 1px solid rgba(126, 87, 194, 0.3);
}
```

また、`App.vue` の `v-main` 背景色はテーマの `background` カラーと重複しているため、インラインスタイルを削除するだけで済む可能性があります。

---

### 3.6 `YearlyTable.vue` テーブルヘッダー背景色のテーマ不整合

#### 現状

`YearlyTable.vue` のスコープ付きスタイルで、テーブルヘッダーに明るい背景色が指定されています。

```css
/* YearlyTable.vue（57〜61行目） */
.yearly-table th {
  background: #dbeafe !important;  /* ライトブルー */
  color: #0f172a !important;       /* ほぼ黒 */
  /* ... */
}
```

#### 問題点

- アプリ全体はダークテーマ（`background: #0D1117`）であるのに、テーブルヘッダーのみ明るい背景色（`#dbeafe`）が使用されており、デザインの一貫性が失われている
- ライトモードへの切り替えを将来導入した場合、このスタイルだけが逆転してしまう

#### 改善案

ダークテーマに合わせたヘッダー背景色に変更する。
`surface-variant` カラー（`#1E2430`）や `primary` カラーの低透明度版を使用することでテーマと整合性を保つ。

```css
.yearly-table th {
  background: rgba(92, 107, 192, 0.2) !important;  /* primary カラーの低透明度 */
  color: #e2e8f0 !important;                        /* ダークテーマ向けの明るいテキスト */
  font-size: 0.8rem !important;
  padding: 10px 16px !important;
  white-space: nowrap;
}
```

---

## 4. 優先度まとめ

| # | 改善点 | 優先度 | 理由 |
|---|---|---|---|
| 1 | `formatCurrency` 関数の共通化 | 高 | 重複コードによるバグリスクが大きい |
| 6 | テーブルヘッダー背景色の修正 | 高 | 現状でデザインが明らかに崩れている |
| 2 | `chartOptions` の `const` 化 | 中 | コードの意図が明確になる・軽微な最適化 |
| 4 | 色値の一元管理 | 中 | 修正箇所が多く、テーマ変更時のリスクを低減できる |
| 5 | インラインスタイルの CSS クラス化 | 中 | 可読性・保守性の向上 |
| 3 | Vuetify 全量インポートの最適化 | 低 | バンドルサイズに影響するが、現時点では開発効率を優先しても許容範囲 |

---

## 5. 変更対象ファイル一覧

| ファイル | 変更の種類 | 改善点 |
|---|---|---|
| `src/utils/formatCurrency.ts`（新規） | 新規作成 | 3.1: `formatCurrency` を共通ユーティリティとして切り出す |
| `src/constants/colors.ts`（新規） | 新規作成 | 3.4: 色定数を一元管理する |
| `src/components/ResultSummary.vue` | 修正 | 3.1, 3.4, 3.5 |
| `src/components/YearlyTable.vue` | 修正 | 3.1, 3.5, 3.6 |
| `src/components/GrowthChart.vue` | 修正 | 3.2, 3.4 |
| `src/components/InputForm.vue` | 修正 | 3.5 |
| `src/App.vue` | 修正 | 3.5 |
| `src/main.ts` | 修正 | 3.3, 3.4 |
| `vite.config.ts` | 修正 | 3.3（案 A を採用する場合） |
| `package.json` | 修正 | 3.3（案 A を採用する場合） |
