# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.1] - 2026-04-06

### Fixed

- Vuetify 4 対応: `v-btn-toggle` に `variant="outlined"`・`divided`・`base-color` を追加し、ボタンの表示崩れを修正
- `v-app` に `theme="dark"` を明示的に設定し、Vuetify 4 でダークテーマが正しく適用されるよう修正
- `v-main` の背景色をハードコードから CSS 変数（`rgb(var(--v-theme-background))`）に変更
- 年次データ一覧のテーブルヘッダー背景色をダークテーマに合わせた色に修正（ライトブルー → テーマカラーベースの半透明）

[0.1.1]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/compare/v0.1.0...v0.1.1

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

[0.1.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.1.0
