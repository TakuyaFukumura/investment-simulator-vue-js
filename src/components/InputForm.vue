<script lang="ts" setup>
import {ref, watch} from 'vue'
import type {InvestmentParams} from '../stores/investmentStore'
import {useInvestmentStore} from '../stores/investmentStore'

const store = useInvestmentStore()

const form = ref<InvestmentParams>({...store.params})
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
    store.updateParams({...form.value})
  }
}

watch(
    () => form.value,
    () => {
      errors.value = {}
    },
    {deep: true}
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
              :error-messages="errors.initialAmount"
              density="comfortable"
              hide-spin-buttons
              label="初期投資額（円）"
              min="0"
              prepend-inner-icon="mdi-cash"
              step="10000"
              type="number"
              variant="outlined"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
              v-model.number="form.monthlyAmount"
              :error-messages="errors.monthlyAmount"
              density="comfortable"
              hide-spin-buttons
              label="毎月積立額（円）"
              min="0"
              prepend-inner-icon="mdi-calendar-month"
              step="1000"
              type="number"
              variant="outlined"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
              v-model.number="form.years"
              :error-messages="errors.years"
              density="comfortable"
              hide-spin-buttons
              label="投資期間（年）"
              max="50"
              min="1"
              prepend-inner-icon="mdi-clock-outline"
              step="1"
              type="number"
              variant="outlined"
          />
        </v-col>
        <v-col cols="12" sm="6">
          <v-text-field
              v-model.number="form.annualRate"
              :error-messages="errors.annualRate"
              density="comfortable"
              hide-spin-buttons
              label="期待利回り（年率 %）"
              max="50"
              min="0.01"
              prepend-inner-icon="mdi-percent"
              step="0.1"
              type="number"
              variant="outlined"
          />
        </v-col>
        <v-col cols="12">
          <div class="text-body-2 text-medium-emphasis mb-2">利回り方式</div>
          <v-btn-toggle
              v-model="form.interestType"
              color="primary"
              density="comfortable"
              mandatory
              rounded="lg"
          >
            <v-btn prepend-icon="mdi-chart-line-variant" value="compound">
              複利
            </v-btn>
            <v-btn prepend-icon="mdi-chart-timeline-variant" value="simple">
              単利
            </v-btn>
          </v-btn-toggle>
        </v-col>
      </v-row>
    </v-card-text>
    <v-card-actions class="px-6 pb-6">
      <v-btn
          :style="{ background: 'linear-gradient(135deg, #5C6BC0, #42A5F5)' }"
          block
          color="primary"
          prepend-icon="mdi-play-circle"
          size="large"
          variant="elevated"
          @click="simulate"
      >
        シミュレーション実行
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
