<script lang="ts" setup>
import InputForm from './components/InputForm.vue'
import ResultSummary from './components/ResultSummary.vue'
import GrowthChart from './components/GrowthChart.vue'
import YearlyTable from './components/YearlyTable.vue'
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="pa-4 pa-md-6" fluid style="max-width: 1200px">
        <!-- Header -->
        <div class="text-center mb-8">
          <div class="d-flex align-center justify-center ga-2 mb-2">
            <v-icon color="primary" size="36">mdi-trending-up</v-icon>
            <h1 class="text-h4 font-weight-bold gradient-text">
              積立投資シミュレーター
            </h1>
          </div>
          <p class="text-body-2 text-medium-emphasis">
            毎月の積立・期間・利回りから投資成績の推移を見える化
          </p>
        </div>

        <!-- Input Form -->
        <v-row class="mb-4">
          <v-col cols="12">
            <InputForm/>
          </v-col>
        </v-row>

        <!-- Result Summary -->
        <v-row class="mb-4">
          <v-col cols="12">
            <ResultSummary/>
          </v-col>
        </v-row>

        <!-- Chart -->
        <v-row class="mb-4">
          <v-col cols="12">
            <GrowthChart/>
          </v-col>
        </v-row>

        <!-- Yearly Table -->
        <v-row class="mb-4">
          <v-col cols="12">
            <YearlyTable/>
          </v-col>
        </v-row>

        <!-- Footer -->
        <div class="text-center text-caption text-disabled pb-4">
          ※ このシミュレーションは参考値であり、実際の運用成果を保証するものではありません
        </div>
      </v-container>
    </v-main>
  </v-app>
</template>
