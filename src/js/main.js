

import { loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';

loadHeaderFooter();

const dataSource = new ProductData();
const listElement = document.querySelector('.product-list');
const myList = new ProductList('tents', dataSource, listElement);
myList.init();




