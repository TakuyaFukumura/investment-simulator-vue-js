<script setup lang="ts">
import { ref, watch } from 'vue'
import { useInvestmentStore } from '../stores/investmentStore'
import type { InvestmentParams } from '../stores/investmentStore'

const store = useInvestmentStore()

const form = ref<InvestmentParams>({ ...store.params })
const errors = ref<Partial<Record<keyof InvestmentParams, string>>>({})

function validate(): boolean {
  errors.value = {}
  if (form.value.initialAmount < 0) {
    errors.value.initialAmount = '初期投資額は0以上で入力してください'
  }
  if (form.value.monthlyAmount < 0) {
    errors.value.monthlyAmount = '毎月積立額は0以上で入力してください'
  }
  if (form.value.years < 1 || form.value.years > 50) {
    errors.value.years = '投資期間は1〜50年で入力してください'
  }
  if (form.value.annualRate < 0.01 || form.value.annualRate > 50) {
    errors.value.annualRate = '期待利回りは0.01〜50%で入力してください'
  }
  if (form.value.initialAmount === 0 && form.value.monthlyAmount === 0) {
    errors.value.initialAmount = '初期投資額を入力するか、毎月積立額を設定してください'
    errors.value.monthlyAmount = '毎月積立額を入力するか、初期投資額を設定してください'
  }
  return Object.keys(errors.value).length === 0
}

function simulate() {
  if (validate()) {
    store.updateParams({ ...form.value })
  }
}

watch(
  () => form.value,
  () => {
    errors.value = {}
  },
  { deep: true }
)
</script>

<template>
  <v-card class="card-glow" color="surface" rounded="lg">
    <v-card-title class="px-6 pt-6 pb-2">
      <div class="d-flex align-center ga-2">
        <v-icon color="primary" size="28">mdi-calculator-variant</v-icon>
        <span class="text-h6 font-weight-bold">投資条件の設定</span>
      </div>
    </v-card-title>
    <v-card-text class="px-6 pb-4">
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="form.initialAmount"
            label="初期投資額（円）"
            type="number"
            min="0"
            step="10000"
            prepend-inner-icon="mdi-cash"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.initialAmount"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="form.monthlyAmount"
            label="毎月積立額（円）"
            type="number"
            min="0"
            step="1000"
            prepend-inner-icon="mdi-calendar-month"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.monthlyAmount"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="form.years"
            label="投資期間（年）"
            type="number"
            min="1"
            max="50"
            step="1"
            prepend-inner-icon="mdi-clock-outline"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.years"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
            v-model.number="form.annualRate"
            label="期待利回り（年率 %）"
            type="number"
            min="0.01"
            max="50"
            step="0.1"
            prepend-inner-icon="mdi-percent"
            variant="outlined"
            density="comfortable"
            :error-messages="errors.annualRate"
            hide-spin-buttons
          />
        </v-col>
        <v-col cols="12">
          <div class="text-body-2 text-medium-emphasis mb-2">利回り方式</div>
          <v-btn-toggle
            v-model="form.interestType"
            mandatory
            color="primary"
            rounded="lg"
            density="comfortable"
          >
            <v-btn value="compound" prepend-icon="mdi-chart-line-variant">
              複利
            </v-btn>
            <v-btn value="simple" prepend-icon="mdi-chart-timeline-variant">
              単利
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-6 pb-6">
      <v-btn
        color="primary"
        variant="elevated"
        size="large"
        block
        prepend-icon="mdi-play-circle"
        @click="simulate"
        :style="{ background: 'linear-gradient(135deg, #5C6BC0, #42A5F5)' }"
      >
        シミュレーション実行
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
