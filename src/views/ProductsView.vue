<script lang="ts">
import axios from 'axios';

// interface Product {
//   productID: number;
//   productName: string;
//   quantitySold: number;
//   price: number;
// }

export default {
  name: 'ProductsView',

  data() {
    return {
      products: [] as Array<{ ProductID: string; ProductName: string; Category: string; firstSaleDate: string; Price: number; totalSales: number }>,
    };
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
  }
};
</script>

<template>
  <div>
    <h2>Liste des produits</h2>
    <table>
      <thead>
        <tr>
          <th>Nom du produit</th>
          <th>Catégorie</th>
          <th>Date d'ajout</th>
          <th>Prix</th>
          <th>Total des ventes</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="product in products" :key="product.ProductName">
          <td>{{ product.ProductName }}</td>
          <td>{{ product.Category }}</td>
          <td>{{ formatDate(product.firstSaleDate) }}</td>
          <td>{{ formatCurrency(product.Price) }}</td>
          <td>{{ product.totalSales }}</td>
        </tr>
      </tbody>
    </table>
    <p v-if="!products.length">Aucun produit disponible pour le moment.</p>
  </div>
</template>


