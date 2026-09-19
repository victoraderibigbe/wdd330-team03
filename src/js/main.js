import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// This line exists to actually make the header and footer show up
// on this page — without calling this function, the empty header
// and footer spots in index.html stay empty.
loadHeaderFooter();

const dataSource = new ProductData('tents');
const productList = new ProductList(
	'tents',
	dataSource,
	document.querySelector('.product-list'),
);

productList.init();