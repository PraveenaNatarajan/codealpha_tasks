const productList = document.getElementById('product-list');
const cart = document.getElementById('cart');
let cartItems = [];

async function fetchProducts() {
    const response = await fetch('http://localhost:5000/api/products');
    const products