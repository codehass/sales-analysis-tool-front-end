<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { Pie } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

defineProps({
  chartData: {
    type: Object as () => ChartData<'pie', number[], string>,
    required: true,
  },
  chartOptions: {
    type: Object as () => ChartOptions<'pie'>,
    required: true,
  },
});

const chartRef = ref();
onMounted(() => {
  if (chartRef.value) {
    chartRef.value.render();
  }
});
</script>

<template>
  <Pie :data="chartData" :options="chartOptions" ref="chartRef" />
</template>
