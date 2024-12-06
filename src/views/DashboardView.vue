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
      salesByCategory: [] as Array<{ category: string; percentage: number; sales: number }>,
      barChartData: {
        labels: [] as string[],
        datasets: [],
      } as ChartData<'bar', number[], string>,
      pieChartData: {
        labels: [] as string[],
        datasets: [],
      } as ChartData<'pie', number[], string>,
      barChartOptions: {},
      pieChartOptions: {},
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
      console.log("Top Products",this.topProducts);
      this.topProducts.map((product) => {
        console.log("Product",product.productName);
      });

      // Fetch category sales
      const categorySalesResponse = await axios.get('http://localhost:5000/api/v1/analytics/category_sales');
      this.salesByCategory = categorySalesResponse.data;

      // Prepare chart data
      this.prepareChartData();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  },
  methods: {
    // Fetch updated trending products when the product limit changes
    fetchTrendingProducts() {
      axios
        .get(`http://localhost:5000/api/v1/analytics/trending_products`, {
          params: { limit: this.productLimit },
        })
        .then((response) => {
          this.topProducts = response.data;
        })
        .catch((error) => {
          console.error('Error fetching trending products:', error);
        });
    },

    // Prepare chart data for bar and pie charts
    prepareChartData() {
      // Bar chart data
      this.barChartData = {
    labels: this.salesByCategory.map((category) => category.category),
    datasets: [
      {
        label: 'Ventes',
        data: this.salesByCategory.map((category) => category.sales),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'],
      },
    ],
  } as ChartData<'bar', number[], string>;;

      // Pie chart data
      this.pieChartData = {
      labels: this.salesByCategory.map((category) => category.category),
      datasets: [
        {
          data: this.salesByCategory.map((category) => category.percentage),
          backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'],
          hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4CAF50', '#8E44AD'],
        },
      ],
    } as ChartData<'pie', number[], string>;

      // Chart options
      this.barChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des ventes par catégorie (Bar Chart)',
          },
        },
      };

    this.pieChartOptions = {
        responsive: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
          },
          title: {
            display: true,
            text: 'Répartition des ventes par catégorie (Pie Chart)',
          },
        },
      } as ChartOptions<'pie'>;
    },
  },
});
</script>

<template>
  <div>
    <h1>Dashboard</h1>
    <div class="stats">
      <h2>Le montant total des ventes</h2>
      <p>{{ totalSales }}</p>

      <h2>Produits les plus vendus</h2>
      <label for="limit">Nombre de produits : </label>
      <input id="limit" type="number" v-model.number="productLimit" @change="fetchTrendingProducts" />

      <ul v-if="topProducts.length">
        <li v-for="product in topProducts" :key="product.productID">
          <h3>{{ product.productName }}</h3>
          <p>{{ product.quantitySold }}</p>
        </li>
      </ul>
      <p v-else>Aucune donnée disponible.</p>
    </div>

    <div>
      <h2>Pourcentage des ventes</h2>
      <ul>
        <li v-for="category in salesByCategory" :key="category.category">
          <p>{{ category.category }}: {{ category.percentage }}%</p>
        </li>
      </ul>
    </div>

    <div>
      <h2>Répartition des ventes par catégorie</h2>
      <BarChart :chartData="barChartData" :chartOptions="barChartOptions" />
      <PieChart :chartData="pieChartData" :chartOptions="pieChartOptions" />
    </div>
  </div>
</template>
