# 積立投資シミュレーター

[![CI](https://github.com/TakuyaFukumura/investment-simulator-vue-js/actions/workflows/ci.yml/badge.svg)](https://github.com/TakuyaFukumura/investment-simulator-vue-js/actions/workflows/ci.yml)

Vue.js 3 + TypeScript + Vite で構築した積立投資シミュレーションWebアプリ。  
毎月の積立額・投資期間・期待利回りを入力するだけで、資産推移をグラフと年次表で視覚化します。

---

## スクリーンショット

<img src="https://github.com/user-attachments/assets/643e7a68-3490-4cb5-9b01-f32b9fadeeb7" alt="App Screenshot" width="800">

---

## 機能

| 機能 | 説明 |
|------|------|
| 投資条件の設定 | 初期投資額・毎月積立額・投資期間・期待利回り（0〜50%）・複利/単利を設定 |
| シミュレーション結果 | 総投資額・最終資産額・運用益（利益率付き）をリアルタイム表示 |
| 資産推移グラフ | 年次折れ線グラフで評価額と累計投資額の推移を可視化 |
| 年次データ表 | 各年の累計投資額・運用益・評価額・利益率を一覧表示 |
| 入力バリデーション | 不正な値に対して日本語エラーメッセージを表示 |

---

## 技術構成

| カテゴリ | ライブラリ・ツール |
|----------|-------------------|
| フレームワーク | [Vue.js 3](https://vuejs.org/) + [TypeScript](https://www.typescriptlang.org/) |
| ビルドツール | [Vite](https://vite.dev/) |
| UIライブラリ | [Vuetify 3](https://vuetifyjs.com/) (ダークテーマ) |
| 状態管理 | [Pinia](https://pinia.vuejs.org/) |
| グラフ | [Chart.js](https://www.chartjs.org/) + [vue-chartjs](https://vue-chartjs.org/) |
| アイコン | [Material Design Icons](https://materialdesignicons.com/) |

---

## セットアップ

### 前提条件

- Node.js 18+
- npm 9+

### インストール

```bash
git clone https://github.com/TakuyaFukumura/investment-simulator-vue-js.git
cd investment-simulator-vue-js
npm install
```

### 開発サーバー起動

```bash
npm run dev
```

ブラウザで [http://localhost:5173](http://localhost:5173) を開いてください。

### ビルド

```bash
npm run build
```

ビルド結果は `dist/` に出力されます。

### プレビュー

```bash
npm run preview
```

---

## ディレクトリ構成

```
src/
  components/
    ├─ InputForm.vue        # 投資条件入力フォーム
    ├─ ResultSummary.vue    # シミュレーション結果サマリ
    ├─ GrowthChart.vue      # 資産推移グラフ
    └─ YearlyTable.vue      # 年次データ一覧表
  stores/
    └─ investmentStore.ts   # Pinia ストア（計算ロジック）
  App.vue
  main.ts
  style.css
```

---

## 計算ロジック

### 複利（月次複利）

```
毎月: 資産 = 資産 × (1 + 年利/12) + 毎月積立額
```

### 単利

```
各年の運用益 = 初期投資額 × 年利 × 経過年数
            + 各年の積立合計 × 年利 × 平均保有期間（yearsRemaining - 0.5）
```

---

## CI / 開発フロー

- **GitHub Actions**: プッシュ・PR 時に型チェックとビルドを自動実行
- **Dependabot**: npm および GitHub Actions の依存関係を毎週自動更新

---

## ライセンス

MIT

---

> ※ このシミュレーションは参考値であり、実際の運用成果を保証するものではありません。
