# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.3.0] - 2026-04-10

### Added

- インフレ率（`inflationRate`）パラメータを追加（デフォルト: 2%）
- インフレ考慮後の実質資産額（`realTotalAssets`）の計算ロジックを追加
- 入力フォームにインフレ率入力フィールド（0〜20%、`mdi-fire` アイコン）を追加
- バリデーションにインフレ率の範囲チェック（0〜20%）を追加
- 資産推移グラフに「評価額（実質）」折れ線（緑: `#66BB6A`）を追加

### Changed

- 期待利回り（`annualRate`）のデフォルト値を 5% → 6% に変更
- グラフの「評価額」ラベルを「評価額（名目）」に変更
- `src/constants/colors.ts` に `success` 色（`#66BB6A`）を追加

## [0.2.1] - 2026-04-10

### Changed

- `formatCurrency` 関数を `src/utils/formatCurrency.ts` として共通化し、重複コードを削除
- `GrowthChart.vue` の `chartOptions` をリアクティブ依存のない `const` 定数に変更
- Vuetify コンポーネントの全量インポートを使用コンポーネントの明示的インポートに変更（バンドルサイズ削減）
- 色定数を `src/constants/colors.ts` に一元管理し、テーマ設定・コンポーネントから参照するよう変更
- 複数コンポーネントのインラインスタイルを `<style scoped>` の CSS クラスに移行

### Fixed

- `YearlyTable.vue` のテーブルヘッダー背景色をダークテーマと整合する色に修正（`#dbeafe` → `rgba(92, 107, 192, 0.2)`）

## [0.2.0] - 2026-04-08

### Changed

- 初期投資額・毎月積立額の入力単位を「円」から「万円」に変更
- デフォルト値を変更（初期投資額: 100万円 → 1,500万円、毎月積立額: 3万円 → 7万円、投資期間: 20年 → 40年）
- バリデーションエラーメッセージに単位（万円）を明記

## [0.1.0] - 2026-04-06

### Added

- 積立投資シミュレーターの初期実装
- 投資条件入力フォーム（初期投資額・毎月積立額・投資期間・期待利回り・複利/単利選択）
- バリデーション機能（範囲チェック・日本語エラーメッセージ）
- 0% 利回りのシミュレーション対応（ベースライン比較用）
- シミュレーション結果サマリ（総投資額・最終資産額・運用益・利益率）
- 資産推移折れ線グラフ（Chart.js）
- 年次データ一覧表（累計投資額・運用益・評価額・利益率）
- Pinia による状態管理と複利/単利計算ロジック
- Vuetify 3 ダークテーマ（ブルー/パープル系）
- GitHub Actions CI ワークフロー（型チェック・ビルド）
- Dependabot による依存関係の自動更新設定

[0.3.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.3.0
[0.2.1]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.2.1
[0.2.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.2.0
[0.1.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.1.0

