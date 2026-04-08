# インフレ率導入 仕様書

## 1. 概要

本ドキュメントは、`investment-simulator-vue-js` プロジェクトのシミュレーションにインフレ率の概念を加えるための仕様を整理したものです。
名目上の資産額だけでなく、インフレを考慮した実質的な購買力ベースの資産額もあわせて可視化することで、より現実的な投資判断の参考情報を提供します。

---

## 2. 目的・背景

現状のシミュレーターは名目利回りに基づく資産推移のみを表示しています。
しかし、インフレが進行すると将来の資産額の実質的な価値は目減りします。
以下の変更を加えることで、ユーザーが「名目資産額」と「インフレ考慮後の実質資産額」の差を直感的に把握できるようにします。

---

## 3. デフォルト値の変更

| パラメータ | 変更前 | 変更後 | 備考 |
|---|---|---|---|
| 期待利回り（`annualRate`） | 5 % | **6 %** | 長期投資の現実的な期待値に近づける |
| インフレ率（`inflationRate`） | ―（未実装） | **2 %** | 新規追加。日本銀行の物価目標に合わせた値 |

---

## 4. 計算仕様

### 4.1 名目資産額（Nominal Total Assets）

現行の `totalAssets` の計算式をそのまま使用します。変更はありません。

**複利の場合**

```
毎月末の資産額 = 前月末資産額 × (1 + 年率 / 12) + 毎月積立額
```

**単利の場合**

```
年末資産額 = 累計投資額 + 初期投資額 × 年率 × 経過年数
           + Σ（各年の積立額 × 年率 × 残存年数 − 0.5）
```

> **注意**: `残存年数 − 0.5` の `−0.5` は、その年の月次積立が年間を通じて均等に行われると仮定したときの平均保有期間の補正です。
> 年初に一括で積み立てると仮定すれば残存年数がそのまま使えますが、月次積立の場合は平均的に年の中間（0.5 年分）しか運用されないため、0.5 年分を差し引いています。

### 4.2 実質資産額（Real Total Assets、インフレ考慮後）

名目資産額をインフレ率で割り引いた値です。

```
実質資産額（y年目） = 名目資産額（y年目） ÷ (1 + インフレ率 / 100) ^ y
```

| 記号 | 意味 |
|---|---|
| `y` | 経過年数（1 〜 `years`） |
| インフレ率 | `inflationRate`（%） |

### 4.3 累計投資額（Total Invested）

現行の `totalInvested` の計算式をそのまま使用します。変更はありません。

```
累計投資額（y年目） = 初期投資額 + 毎月積立額 × 12 × y
```

---

## 5. データ構造の変更

### 5.1 `InvestmentParams` インターフェース（`src/stores/investmentStore.ts`）

`inflationRate` フィールドを追加します。

```typescript
export interface InvestmentParams {
    initialAmount: number
    monthlyAmount: number
    years: number
    annualRate: number        // デフォルト値を 5 → 6 に変更
    inflationRate: number     // 新規追加。デフォルト値 2
    interestType: 'compound' | 'simple'
}
```

### 5.2 `YearlyData` インターフェース（`src/stores/investmentStore.ts`）

`realTotalAssets` フィールドを追加します。

```typescript
export interface YearlyData {
    year: number
    investmentGain: number
    totalInvested: number
    totalAssets: number       // 名目資産額（変更なし）
    realTotalAssets: number   // 新規追加。インフレ考慮後の実質資産額
}
```

### 5.3 `params` の初期値変更（`src/stores/investmentStore.ts`）

```typescript
const params = ref<InvestmentParams>({
    initialAmount: 1000000,
    monthlyAmount: 30000,
    years: 20,
    annualRate: 6,         // 5 → 6 に変更
    inflationRate: 2,      // 新規追加
    interestType: 'compound',
})
```

### 5.4 `yearlyData` 計算ロジックの変更（`src/stores/investmentStore.ts`）

各年の `realTotalAssets` を計算して `YearlyData` に追加します。

```typescript
const inflationFactor = (1 + inflationRate / 100) ** y
const realTotalAssets = totalAssets / inflationFactor

result.push({
    year: y,
    investmentGain,
    totalInvested,
    totalAssets,
    realTotalAssets,  // 新規追加
})
```

---

## 6. UI 仕様

### 6.1 入力フォーム（`src/components/InputForm.vue`）

インフレ率の入力フィールドを追加します。

| 項目 | 詳細 |
|---|---|
| ラベル | `インフレ率（年率 %）` |
| 入力タイプ | `number` |
| 最小値 | `0` |
| 最大値 | `20` |
| ステップ | `0.1` |
| アイコン | `mdi-fire` |
| バリデーション | 0 〜 20 % の範囲外の場合エラーメッセージを表示 |

バリデーションエラーメッセージの例：
```
インフレ率は0〜20%で入力してください
```

### 6.2 資産推移グラフ（`src/components/GrowthChart.vue`）

折れ線グラフに **3本** のデータセットを表示します。

| データセット | `label` | 色 | 説明 |
|---|---|---|---|
| 名目資産額 | `評価額（名目）` | `#42A5F5`（青） | 現行の `totalAssets`（変更なし） |
| インフレ考慮後評価額 | `評価額（実質）` | `#66BB6A`（緑） | 新規追加。`realTotalAssets` |
| 累計投資額 | `累計投資額` | `#5C6BC0`（紫） | 現行の `totalInvested`（変更なし） |

グラフ追加例（`chartData` の `datasets` に追記）：

```typescript
{
    label: '評価額（実質）',
    data: store.yearlyData.map((d) => d.realTotalAssets),
    borderColor: '#66BB6A',
    backgroundColor: 'rgba(102, 187, 106, 0.1)',
    borderWidth: 2.5,
    pointRadius: 3,
    pointHoverRadius: 6,
    fill: false,
    tension: 0.3,
},
```

既存のデータセットラベルも合わせて変更します。

| 変更前 | 変更後 |
|---|---|
| `評価額` | `評価額（名目）` |

---

## 7. 変更対象ファイル一覧

| ファイル | 変更の種類 | 変更内容の概要 |
|---|---|---|
| `src/stores/investmentStore.ts` | 修正 | `InvestmentParams` に `inflationRate` 追加、`YearlyData` に `realTotalAssets` 追加、デフォルト値変更（`annualRate: 6`、`inflationRate: 2`）、計算ロジックに実質資産額の算出を追加 |
| `src/components/InputForm.vue` | 修正 | インフレ率入力フィールドの追加、バリデーション追加 |
| `src/components/GrowthChart.vue` | 修正 | 実質資産額の折れ線グラフ（緑）を追加、既存ラベルを `評価額（名目）` に変更 |

---

## 8. 実装手順

### Step 1: ストアの修正（`src/stores/investmentStore.ts`）

1. `InvestmentParams` に `inflationRate: number` を追加する
2. `YearlyData` に `realTotalAssets: number` を追加する
3. `params` の初期値を `annualRate: 6`、`inflationRate: 2` に変更する
4. `yearlyData` の計算ループ内で `realTotalAssets` を算出し `result.push()` に追加する

### Step 2: 入力フォームの修正（`src/components/InputForm.vue`）

1. `form` の初期値に `inflationRate` が含まれることを確認する（`InvestmentParams` の変更で自動反映）
2. バリデーション関数 `validate()` にインフレ率の範囲チェック（0 〜 20 %）を追加する
3. テンプレートにインフレ率入力用の `<v-text-field>` を追加する

### Step 3: グラフの修正（`src/components/GrowthChart.vue`）

1. `chartData` の `datasets` 配列に実質資産額のデータセットを追加する
2. 既存の `評価額` ラベルを `評価額（名目）` に変更する

### Step 4: 動作確認

```bash
npm run dev
```

ブラウザで以下の点を確認します。

- インフレ率フィールドが表示され、デフォルト値が 2 % であること
- 期待利回りのデフォルト値が 6 % であること
- グラフに「評価額（名目）」「評価額（実質）」「累計投資額」の 3 本の折れ線が表示されること
- インフレ率を変更するとグラフの「評価額（実質）」が動的に更新されること
- バリデーションエラーが正しく表示されること

### Step 5: ビルド確認

```bash
npm run build
```

---

## 9. 注意事項・リスク

| リスク | 対応策 |
|---|---|
| `InvestmentParams` の変更により `InputForm.vue` の `form` 初期化に影響する可能性がある | `form` は `{...store.params}` でコピーしているため、ストアの初期値変更が自動的に反映されるが、動作確認を必ず行う |
| インフレ率が高い場合（例: 20 %）、実質資産額が累計投資額を大幅に下回り、グラフが見づらくなる可能性がある | 現時点では仕様として許容する。必要に応じて Y 軸の最小値やスケールを調整する |
| 既存のスナップショットテストや単体テストが `YearlyData` 型の変更により失敗する可能性がある | テストコードも合わせて修正する（現時点ではテストファイルは存在しない） |
