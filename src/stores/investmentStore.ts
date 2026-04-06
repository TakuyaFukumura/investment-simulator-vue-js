import {defineStore} from 'pinia'
import {computed, ref} from 'vue'

export interface YearlyData {
    year: number
    investmentGain: number
    totalInvested: number
    totalAssets: number
}

export interface InvestmentParams {
    initialAmount: number
    monthlyAmount: number
    years: number
    annualRate: number
    interestType: 'compound' | 'simple'
}

export const useInvestmentStore = defineStore('investment', () => {
    const params = ref<InvestmentParams>({
        initialAmount: 1000000,
        monthlyAmount: 30000,
        years: 20,
        annualRate: 5,
        interestType: 'compound',
    })

    const yearlyData = computed<YearlyData[]>(() => {
        const {initialAmount, monthlyAmount, years, annualRate, interestType} = params.value
        const rate = annualRate / 100
        const result: YearlyData[] = []

        if (interestType === 'compound') {
            let totalAssets = initialAmount
            for (let y = 1; y <= years; y++) {
                const monthlyRate = rate / 12
                for (let m = 0; m < 12; m++) {
                    totalAssets = totalAssets * (1 + monthlyRate) + monthlyAmount
                }
                const totalInvested = initialAmount + monthlyAmount * 12 * y
                const investmentGain = totalAssets - totalInvested
                result.push({
                    year: y,
                    investmentGain,
                    totalInvested,
                    totalAssets,
                })
            }
        } else {
            // Simple interest: gain = principal * rate * time
            for (let y = 1; y <= years; y++) {
                const totalInvested = initialAmount + monthlyAmount * 12 * y
                // Simple interest applied on the accumulated principal each year
                const initialGain = initialAmount * rate * y
                // For monthly contributions with simple interest: sum of each contribution's interest
                // Contribution made at start of month m in year y earns interest for (years - fractional_year) years
                // Approximate: each year's contributions earn interest proportionally
                let monthlyContributionGain = 0
                for (let contributionYear = 1; contributionYear <= y; contributionYear++) {
                    const yearsRemaining = y - contributionYear + 1
                    // Subtract 0.5 to approximate that contributions are spread evenly throughout the year
                    // (average holding period within the year is ~6 months, i.e. 0.5 years)
                    monthlyContributionGain += monthlyAmount * 12 * rate * (yearsRemaining - 0.5)
                }
                const investmentGain = initialGain + monthlyContributionGain
                const totalAssets = totalInvested + investmentGain
                result.push({
                    year: y,
                    investmentGain,
                    totalInvested,
                    totalAssets,
                })
            }
        }

        return result
    })

    const finalAssets = computed(() => yearlyData.value.at(-1)?.totalAssets ?? 0)

    const totalInvested = computed(() => yearlyData.value.at(-1)?.totalInvested ?? 0)

    const totalGain = computed(() => finalAssets.value - totalInvested.value)

    function updateParams(newParams: InvestmentParams) {
        params.value = {...newParams}
    }

    return {
        params,
        yearlyData,
        finalAssets,
        totalInvested,
        totalGain,
        updateParams,
    }
})
