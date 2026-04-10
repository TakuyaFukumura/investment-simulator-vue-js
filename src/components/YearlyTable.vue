<script lang="ts" setup>
import {useInvestmentStore} from '../stores/investmentStore'
import {formatCurrency} from '../utils/formatCurrency'

const store = useInvestmentStore()
</script>

<template>
  <v-card class="card-glow" color="surface" rounded="lg">
    <v-card-title class="px-6 pt-6 pb-4">
      <div class="d-flex align-center ga-2">
        <v-icon color="secondary" size="28">mdi-table</v-icon>
        <span class="text-h6 font-weight-bold">年次データ一覧</span>
      </div>
    </v-card-title>
    <v-card-text class="px-0 pb-4">
      <v-table class="yearly-table" density="compact">
        <thead>
        <tr>
          <th class="text-center" scope="col">年数</th>
          <th class="text-right" scope="col">累計投資額</th>
          <th class="text-right" scope="col">運用益</th>
          <th class="text-right" scope="col">評価額</th>
          <th class="text-right" scope="col">利益率</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="row in store.yearlyData" :key="row.year">
          <td class="text-center text-medium-emphasis">{{ row.year }}年目</td>
          <td class="text-right">{{ formatCurrency(row.totalInvested) }}</td>
          <td class="text-right text-accent">
            +{{ formatCurrency(row.investmentGain) }}
          </td>
          <td class="text-right font-weight-medium">
            {{ formatCurrency(row.totalAssets) }}
          </td>
          <td class="text-right text-secondary">
            {{ row.totalInvested > 0 ? ((row.investmentGain / row.totalInvested) * 100).toFixed(1) : '0.0' }}%
          </td>
        </tr>
        </tbody>
      </v-table>
    </v-card-text>
  </v-card>
</template>

<style scoped>
.yearly-table th {
  background: rgba(92, 107, 192, 0.2) !important;
  color: #e2e8f0 !important;
  font-size: 0.8rem !important;
  padding: 10px 16px !important;
  white-space: nowrap;
}

.yearly-table td {
  font-size: 0.85rem !important;
  padding: 8px 16px !important;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important;
}

.yearly-table tbody tr:hover td {
  background: rgba(var(--v-theme-primary), 0.08) !important;
}
</style>

