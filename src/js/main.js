

import { loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

// This line exists to actually make the header and footer show up
// on this page — without calling this function, the empty header
// and footer spots in index.html stay empty.
loadHeaderFooter();

loadHeaderFooter();

const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const myList = new ProductList('tents', dataSource, listElement);
myList.init();




productList.init();
