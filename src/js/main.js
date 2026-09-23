import { loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

loadHeaderFooter();

const dataSource = new ExternalServices();
const listElement = document.querySelector('.product-list');
const myList = new ProductList('tents', dataSource, listElement);
myList.init();