<script lang="ts" setup>
import { defineProps, ref, onMounted } from 'vue';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';
import { Bar } from 'vue-chartjs';
import type { ChartData, ChartOptions } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

defineProps({
  chartData: {
    type: Object as () => ChartData<'bar', number[], string>,
    required: true,
  },
  chartOptions: {
    type: Object as () => ChartOptions<'bar'>,
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
  <Bar :data="chartData" :options="chartOptions" ref="chartRef" />
</template>
