<script lang="ts" setup>
import {computed} from 'vue'
import {useInvestmentStore} from '../stores/investmentStore'
import {formatCurrency} from '../utils/formatCurrency'

const store = useInvestmentStore()

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
          <div class="result-card result-card--primary pa-4 rounded-lg text-center">
            <div class="text-caption text-medium-emphasis mb-1">総投資額</div>
            <div class="text-h6 font-weight-bold text-primary">
              {{ formatCurrency(store.totalInvested) }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="result-card result-card--accent pa-4 rounded-lg text-center">
            <div class="text-caption text-medium-emphasis mb-1">最終資産額</div>
            <div class="text-h6 font-weight-bold text-accent">
              {{ formatCurrency(store.finalAssets) }}
            </div>
          </div>
        </v-col>
        <v-col cols="12" sm="4">
          <div class="result-card result-card--secondary pa-4 rounded-lg text-center">
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

<style scoped>
.result-card--primary {
  background: rgba(var(--v-theme-primary), 0.12);
  border: 1px solid rgba(var(--v-theme-primary), 0.3);
}

.result-card--accent {
  background: rgba(var(--v-theme-accent), 0.12);
  border: 1px solid rgba(var(--v-theme-accent), 0.3);
}

.result-card--secondary {
  background: rgba(var(--v-theme-secondary), 0.12);
  border: 1px solid rgba(var(--v-theme-secondary), 0.3);
}
</style>

