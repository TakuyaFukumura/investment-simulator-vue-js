# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-04-07

### Changed

- Vuetify 3 から Vuetify 4 へ移行
  - `vuetify` を `^3.12.5` から `^4.0.0` へ更新
  - `vite-plugin-vuetify` を devDependencies に追加し、コンポーネントのオートインポートを有効化
  - `src/main.ts` からコンポーネント・ディレクティブの全量インポートを削除（ツリーシェイキングへ移行）
  - テーマ定義から廃止された `dark: true` プロパティを削除
  - `vite.config.ts` に `vite-plugin-vuetify` プラグインを追加

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

[0.2.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/compare/v0.1.0...v0.2.0
[0.1.0]: https://github.com/TakuyaFukumura/investment-simulator-vue-js/releases/tag/v0.1.0
