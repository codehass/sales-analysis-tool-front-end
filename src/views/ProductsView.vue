<script lang="ts">
import axios from 'axios';

export default {
  name: 'ProductsView',
  data() {
    return {
      products: [] as Array<{ ProductID: string; ProductName: string; Category: string; firstSaleDate: string; Price: number; totalSales: number }>,
      itemsPerPage: 10,
      currentPage: 1,
      itemsPerPageOptions: [10, 20, 50, 100],
    };
  },
  computed: {
    paginatedProducts() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.products.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage);
    },
  },
  async created() {
    const response = await axios.get('http://localhost:5000/api/v1/analytics/products');
    this.products = response.data;
    console.log(this.products);
  },
  methods: {
    formatDate(dateString: string) {
      const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    },
    formatCurrency(value: number) {
      return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    },
    changePage(page: number) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
  },
};
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
      <h2 class="text-2xl font-bold mb-4">Product List</h2>
      
      <!-- Items Per Page Dropdown -->
      <div class="flex justify-between items-center mb-4">
        <div>
          <label for="itemsPerPage" class="font-medium">Items per page:</label>
          <select
            id="itemsPerPage"
            v-model.number="itemsPerPage"
            class="ml-2 border rounded px-2 py-1"
          >
            <option v-for="option in itemsPerPageOptions" :key="option" :value="option">
              {{ option }}
            </option>
          </select>
        </div>
        <p class="text-gray-600">
          Showing {{ paginatedProducts.length }} of {{ products.length }} products
        </p>
      </div>

      <!-- Products Table -->
      <table class="w-full table-auto border-collapse bg-white shadow-md rounded-lg">
        <thead class="bg-gray-200 text-gray-700">
          <tr>
            <th class="py-2 px-4 border">Product Name</th>
            <th class="py-2 px-4 border">Category</th>
            <th class="py-2 px-4 border">First Sale Date</th>
            <th class="py-2 px-4 border">Price</th>
            <th class="py-2 px-4 border">Total Sales</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="product in paginatedProducts"
            :key="product.ProductID"
            class="even:bg-gray-50"
          >
            <td class="py-2 px-4 border">{{ product.ProductName }}</td>
            <td class="py-2 px-4 border">{{ product.Category }}</td>
            <td class="py-2 px-4 border">{{ formatDate(product.firstSaleDate) }}</td>
            <td class="py-2 px-4 border">{{ formatCurrency(product.Price) }}</td>
            <td class="py-2 px-4 border">{{ product.totalSales }}</td>
          </tr>
        </tbody>
      </table>

      <!-- Pagination -->
      <div class="mt-4 flex justify-between items-center">
        <button
          @click="changePage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="px-4 py-2 bg-gray-300 text-gray-600 rounded disabled:opacity-50"
        >
          Previous
        </button>
        <p>
          Page {{ currentPage }} of {{ totalPages }}
        </p>
        <button
          @click="changePage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="px-4 py-2 bg-gray-300 text-gray-600 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      <p v-if="!products.length" class="text-center text-gray-600 mt-4">
        No products available at the moment.
      </p>
    </div>
  </div>
</template>
