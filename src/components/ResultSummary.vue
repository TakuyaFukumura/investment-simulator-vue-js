<script setup lang="ts">
import { computed } from 'vue'
import { useInvestmentStore } from '../stores/investmentStore'

const store = useInvestmentStore()

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('ja-JP', {
    style: 'currency',
    currency: 'JPY',
    maximumFractionDigits: 0,
  }).format(value)
}

const gainRatio = computed(() => {
  if (store.totalInvested === 0) return 0
  return ((store.totalGain / store.totalInvested) * 100).toFixed(1)
})
</script>

<template>
  <v-card class="card-glow" color="surface" rounded="lg">
    <v-card-title class="px-6 pt-6 pb-4">
      <div class="d-flex align-center ga-2">
        <v-icon color="accent" size="28">mdi-chart-bar</v-icon>
        <span class="text-h6 font-weight-bold">シミュレーション結果</span>
      </div>
    </v-card-title>
    <v-card-text class="px-6 pb-6">
      <v-row>
        <v-col cols="12" sm="4">
          <div
            class="result-card pa-4 rounded-lg text-center"
            style="background: rgba(92, 107, 192, 0.12); border: 1px solid rgba(92, 107, 192, 0.3)"
          >
            <div class="text-caption text-medium-emphasis mb-1">総投資額</div>
            <div class="text-h6 font-weight-bold text-primary">
              {{ formatCurrency(store.totalInvested) }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div
            class="result-card pa-4 rounded-lg text-center"
            style="background: rgba(66, 165, 245, 0.12); border: 1px solid rgba(66, 165, 245, 0.3)"
          >
            <div class="text-caption text-medium-emphasis mb-1">最終資産額</div>
            <div class="text-h6 font-weight-bold" style="color: #42A5F5">
              {{ formatCurrency(store.finalAssets) }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div
            class="result-card pa-4 rounded-lg text-center"
            style="background: rgba(126, 87, 194, 0.12); border: 1px solid rgba(126, 87, 194, 0.3)"
          >
            <div class="text-caption text-medium-emphasis mb-1">運用益（利益率）</div>
            <div class="text-h6 font-weight-bold text-secondary">
              {{ formatCurrency(store.totalGain) }}
              <span class="text-body-2">(+{{ gainRatio }}%)</span>
            </div>
          </div>
        </v-col>
      </v-row>
    </v-card-text>
  </v-card>
</template>
