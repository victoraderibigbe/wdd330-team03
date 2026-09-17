import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter, getUrlParam } from './utils.mjs';

// This line exists so the header and footer show up on this
// page too, the same way we set it up on every other page.
loadHeaderFooter();

// This reads the ?category=... part of the URL, so this page
// knows whether the shopper clicked Tents, Backpacks, etc.
const category = getUrlParam('category');

// This line exists so the page's heading shows which category the
// shopper is currently browsing, e.g. "Top Products: backpacks"
document.querySelector('h2').textContent = `Top Products: ${category}`;



const dataSource = new ProductData();
const productList = new ProductList(
    category,
    dataSource,
    document.querySelector('.product-list'),
);

productList.init();
