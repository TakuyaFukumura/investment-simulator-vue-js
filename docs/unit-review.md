# 投資条件入力欄の単位見直し仕様書

## 1. 概要

本ドキュメントは、`investment-simulator-vue-js` の投資条件設定欄における単位の見直しとデフォルト値の変更に関する仕様を整理したものです。

---

## 2. 変更の目的

- 初期投資額・毎月積立額の入力単位を「円」から「万円」に変更することで、大きな金額をユーザーが入力しやすくする
- デフォルト値を一般的な長期積立投資のモデルケースに合わせ直すことで、シミュレーション開始時の利便性を高める

---

## 3. 変更内容

### 3.1 単位の変更

| 入力項目 | 現在の単位 | 変更後の単位 |
|---|---|---|
| 初期投資額 | 円 | 万円 |
| 毎月積立額 | 円 | 万円 |

入力値（万円）は内部計算時に `× 10,000` して円換算を行います。

### 3.2 デフォルト値の変更

| 入力項目 | 現在のデフォルト値 | 変更後のデフォルト値 |
|---|---|---|
| 初期投資額 | 100万円（1,000,000円） | 1,500万円 |
| 毎月積立額 | 3万円（30,000円） | 7万円 |
| 投資期間 | 20年 | 40年 |

---

## 4. 変更対象ファイル

| ファイル | 変更の種類 | 変更内容の概要 |
|---|---|---|
| `src/stores/investmentStore.ts` | 修正 | デフォルト値を変更（初期投資額・毎月積立額・投資期間） |
| `src/components/InputForm.vue` | 修正 | ラベルの単位を「円」→「万円」に変更、step 値の調整、単位変換処理の追加 |

---

## 5. 詳細仕様

### 5.1 `src/stores/investmentStore.ts`

#### 5.1.1 デフォルト値の変更

```diff
 const params = ref<InvestmentParams>({
-    initialAmount: 1000000,
-    monthlyAmount: 30000,
-    years: 20,
+    initialAmount: 15000000,
+    monthlyAmount: 70000,
+    years: 40,
     annualRate: 5,
     interestType: 'compound',
 })
```

| パラメータ | 変更前 | 変更後 |
|---|---|---|
| `initialAmount` | 1,000,000円（100万円） | 15,000,000円（1,500万円） |
| `monthlyAmount` | 30,000円（3万円） | 70,000円（7万円） |
| `years` | 20年 | 40年 |

> **補足**: ストア内の `initialAmount` と `monthlyAmount` は引き続き円単位で保持します。
> 内部の計算ロジック（`yearlyData` の computed プロパティ）は変更不要です。

### 5.2 `src/components/InputForm.vue`

#### 5.2.1 フォームの初期値（万円単位への変換）

`form` の初期値は `store.params` から生成されています。
ストアが円単位で値を持つため、フォームへの初期化時に万円単位へ変換します。

```diff
-const form = ref<InvestmentParams>({...store.params})
+const form = ref({
+  ...store.params,
+  initialAmount: store.params.initialAmount / 10000,
+  monthlyAmount: store.params.monthlyAmount / 10000,
+})
```

#### 5.2.2 ラベルの変更

```diff
-label="初期投資額（円）"
+label="初期投資額（万円）"
```

```diff
-label="毎月積立額（円）"
+label="毎月積立額（万円）"
```

#### 5.2.3 入力 step 値の調整

単位が万円になるため、`step` 値を以下のように変更します。

| 入力項目 | 現在の step | 変更後の step |
|---|---|---|
| 初期投資額 | 10000 | 1 |
| 毎月積立額 | 1000 | 1 |

#### 5.2.4 シミュレーション実行時の単位変換

`simulate()` 関数でストアに渡す前に、万円から円への変換を行います。

```diff
 function simulate() {
   if (validate()) {
-    store.updateParams({...form.value})
+    store.updateParams({
+      ...form.value,
+      initialAmount: form.value.initialAmount * 10000,
+      monthlyAmount: form.value.monthlyAmount * 10000,
+    })
   }
 }
```

#### 5.2.5 バリデーションの調整

入力値の解釈が万円単位になるため、エラーメッセージも合わせて修正します。

```diff
-errors.value.initialAmount = '初期投資額は0以上で入力してください'
+errors.value.initialAmount = '初期投資額は0以上で入力してください（単位：万円）'
```

```diff
-errors.value.monthlyAmount = '毎月積立額は0以上で入力してください'
+errors.value.monthlyAmount = '毎月積立額は0以上で入力してください（単位：万円）'
```

---

## 6. 留意事項

- `YearlyTable.vue` および `ResultSummary.vue` はストアの円単位の値を参照して表示しているため、表示側の変更は不要です。
- フォームのバリデーションで判定する閾値は万円単位に揃えて記述します（例：0万円以上）。

---

## 7. 参考

- 現在の実装：`src/stores/investmentStore.ts`、`src/components/InputForm.vue`
