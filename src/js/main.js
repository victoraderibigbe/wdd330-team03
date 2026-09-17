import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// This line exists so the header and footer show up on this
// page too, the same way we set it up on every other page.
loadHeaderFooter();

const dataSource = new ProductData('tents');
const productList = new ProductList(
	'tents',
	dataSource,
	document.querySelector('.product-list'),
);

productList.init();