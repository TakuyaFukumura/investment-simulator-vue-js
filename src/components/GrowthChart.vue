<script lang="ts" setup>
import {computed} from 'vue'
import {Line} from 'vue-chartjs'
import type {TooltipItem} from 'chart.js'
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from 'chart.js'
import {useInvestmentStore} from '../stores/investmentStore'

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
)

const store = useInvestmentStore()

const chartData = computed(() => ({
  labels: store.yearlyData.map((d) => `${d.year}年目`),
  datasets: [
    {
      label: '評価額',
      data: store.yearlyData.map((d) => d.totalAssets),
      borderColor: '#42A5F5',
      backgroundColor: 'rgba(66, 165, 245, 0.1)',
      borderWidth: 2.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.3,
    },
    {
      label: '累計投資額',
      data: store.yearlyData.map((d) => d.totalInvested),
      borderColor: '#5C6BC0',
      backgroundColor: 'rgba(92, 107, 192, 0.1)',
      borderWidth: 2.5,
      pointRadius: 3,
      pointHoverRadius: 6,
      fill: true,
      tension: 0.3,
    },
  ],
}))

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index' as const,
    intersect: false,
  },
  plugins: {
    legend: {
      labels: {
        color: '#9ca3af',
        usePointStyle: true,
        pointStyleWidth: 12,
        font: {size: 12},
      },
    },
    tooltip: {
      backgroundColor: '#1E2430',
      borderColor: 'rgba(92,107,192,0.4)',
      borderWidth: 1,
      titleColor: '#e2e8f0',
      bodyColor: '#9ca3af',
      callbacks: {
        label(ctx: TooltipItem<'line'>) {
          return ` ${ctx.dataset.label}: ¥${(ctx.raw as number).toLocaleString('ja-JP')}`
        },
      },
    },
  },
  scales: {
    x: {
      ticks: {color: '#6b7280', font: {size: 11}},
      grid: {color: 'rgba(255,255,255,0.05)'},
    },
    y: {
      ticks: {
        color: '#6b7280',
        font: {size: 11},
        callback: (value: number | string) => {
          const num = typeof value === 'string' ? Number.parseFloat(value) : value
          if (num >= 100000000) return `${(num / 100000000).toFixed(1)}億`
          if (num >= 10000) return `${(num / 10000).toFixed(0)}万`
          return value
        },
      },
      grid: {color: 'rgba(255,255,255,0.05)'},
    },
  },
}))
</script>

<template>
  <v-card class="card-glow" color="surface" rounded="lg">
    <v-card-title class="px-6 pt-6 pb-4">
      <div class="d-flex align-center ga-2">
        <v-icon color="accent" size="28">mdi-chart-line</v-icon>
        <span class="text-h6 font-weight-bold">資産推移グラフ</span>
      </div>
    </v-card-title>
    <v-card-text class="px-4 pb-6">
      <div style="height: 360px; position: relative">
        <Line :data="chartData" :options="chartOptions"/>
      </div>
    </v-card-text>
  </v-card>
</template>
