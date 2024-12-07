<script lang="ts">
import axios from 'axios';
import { defineComponent } from 'vue';
import BarChart from '@/components/BarChart.vue';
import PieChart from '@/components/PieChart.vue';
import type { ChartData, ChartOptions } from 'chart.js';

export default defineComponent({
  name: 'DashboardView',
  components: {
    BarChart,
    PieChart,
  },
  data() {
    return {
      totalSales: 0,
      productLimit: 3,
      topProducts: [] as Array<{ productID: string; productName: string; quantitySold: number }>,
      salesByCategory: [] as Array<{ category: string; percentage: number; salesCount: number }>,
      barChartData: {
        labels: [] as string[],
        datasets: [],
      } as ChartData<'bar', number[], string>,
      pieChartData: {
        labels: [] as string[],
        datasets: [],
      } as ChartData<'pie', number[], string>,
      barChartOptions: {} as ChartOptions<'bar'>,
      pieChartOptions: {} as ChartOptions<'pie'>,
      isLoading: true,
      errorMessage: '',
    };
  },
  async created() {
    try {
      // Fetch total sales
      const salesResponse = await axios.get('http://localhost:5000/api/v1/analytics/total_sales');
      this.totalSales = salesResponse.data.totalSales;

      // Fetch trending products
      const trendingResponse = await axios.get(`http://localhost:5000/api/v1/analytics/trending_products`, {
        params: { limit: this.productLimit },
      });
      this.topProducts = trendingResponse.data;

      // Fetch category sales
      const categorySalesResponse = await axios.get('http://localhost:5000/api/v1/analytics/category_sales');
      this.salesByCategory = categorySalesResponse.data;

      console.log(this.salesByCategory);
      this.salesByCategory.map((category) => console.log(category.salesCount ) )

      // Prepare chart data
      this.prepareChartData();
    } catch (error) {
      this.errorMessage = 'Failed to load data. Please try again later.' + error;
    } finally {
      this.isLoading = false;
    }
  },
  methods: {
    fetchTrendingProducts() {
      axios
        .get(`http://localhost:5000/api/v1/analytics/trending_products`, {
          params: { limit: this.productLimit },
        })
        .then((response) => {
          this.topProducts = response.data;
        })
        .catch(() => {
          this.errorMessage = 'Failed to fetch trending products.';
        });
    },
    prepareChartData() {
      this.barChartData = {
        labels: this.salesByCategory.map((category) => category.category),
        datasets: [
          {
            label: 'Sales',
            data: this.salesByCategory.map((category) => category.salesCount  ),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'],
          },
        ],
      };
      this.pieChartData = {
        labels: this.salesByCategory.map((category) => category.category),
        datasets: [
          {
            data: this.salesByCategory.map((category) => category.percentage),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'],
          },
        ],
      };
      this.barChartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: 'Sales Distribution by Category (Bar Chart)' },
        },
      };
      this.pieChartOptions = {
        responsive: true,
        plugins: {
          legend: { display: true, position: 'top' },
          title: { display: true, text: 'Sales Distribution by Category (Pie Chart)' },
        },
      };
    },
  },
});
</script>

<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Navbar -->
    <nav class="bg-gray-800 text-white p-4">
      <div class="container mx-auto flex justify-between items-center">
        <router-link to="/" class="text-xl font-bold">Dashboard</router-link>
        <ul class="flex space-x-4">
          <li><router-link to="/" class="hover:underline">Home</router-link></li>
          <li><router-link to="/products" class="hover:underline">Products</router-link></li>
        </ul>
      </div>
    </nav>

    <!-- Main Content -->
    <div class="container mx-auto p-6">
      <h1 class="text-3xl font-bold mb-6">Manager's Dashboard</h1>

      <!-- Loading/Error States -->
      <div v-if="isLoading" class="text-blue-500 font-medium">Loading...</div>
      <div v-else-if="errorMessage" class="text-red-500 font-medium">{{ errorMessage }}</div>
      <div v-else>
        <!-- Dashboard Stats -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <!-- Total Sales -->
          <div class="bg-green-100 p-6 rounded shadow flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-12 h-12 text-green-700 mr-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 10h11M9 21V9a3 3 0 00-3-3H4m0 0V5a3 3 0 013-3h3a3 3 0 013 3v1h4m-4 0v11"
              />
            </svg>
            <div>
              <h2 class="text-lg font-semibold">Total Sales</h2>
              <p class="text-2xl font-bold text-green-700">{{ totalSales }}</p>
            </div>
          </div>

          <!-- Top Selling Products -->
          <div class="bg-blue-100 p-6 rounded shadow flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-12 h-12 text-blue-700 mr-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z"
              />
            </svg>
            <div>
              <h2 class="text-lg font-semibold">Top Selling Products</h2>
              <p class="text-2xl font-bold text-blue-700">{{ topProducts.length }}</p>
            </div>
          </div>

          <!-- Sales Percentage -->
          <div class="bg-yellow-100 p-6 rounded shadow flex items-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-12 h-12 text-yellow-700 mr-4"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M11 3a8 8 0 100 16 8 8 0 000-16zm0 4a4 4 0 000 8 4 4 0 000-8z"
              />
            </svg>
            <div>
              <h2 class="text-lg font-semibold">Sales Percentage</h2>
              <p class="text-2xl font-bold text-yellow-700">{{ salesByCategory.length }}</p>
            </div>
          </div>
        </div>

        <!-- Sales Charts -->
        <div class="mb-6">
          <h2 class="text-xl font-semibold mb-4">Sales Distribution</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <BarChart :chartData="barChartData" :chartOptions="barChartOptions" />
            <PieChart :chartData="pieChartData" :chartOptions="pieChartOptions" />
          </div>
        </div>

        <!-- Top Selling Products List -->
        <div>
          <h2 class="text-xl font-semibold mb-4">Top Selling Products</h2>
          <div class="flex items-center mb-4">
            <label for="limit" class="mr-2 font-medium">Number of products:</label>
            <input
              id="limit"
              type="number"
              v-model.number="productLimit"
              @change="fetchTrendingProducts"
              class="border border-gray-300 rounded px-2 py-1"
            />
          </div>
          <ul v-if="topProducts.length" class="space-y-3">
            <li
              v-for="product in topProducts"
              :key="product.productID"
              class="bg-white p-4 rounded shadow flex justify-between items-center"
            >
              <div>
                <h3 class="font-semibold text-lg">{{ product.productName }}</h3>
                <p class="text-gray-600">Quantity Sold: {{ product.quantitySold }}</p>
              </div>
              <div class="text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                  stroke="currentColor"
                  class="w-6 h-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M11 13.5V6m0 7.5l6 6m-6-6l-6 6"
                  />
                </svg>
              </div>
            </li>
          </ul>
          <p v-else class="text-gray-500">No data available.</p>
        </div>
      </div>
    </div>
  </div>
</template>






