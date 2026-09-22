import ProductList from './ProductList.mjs';
import ProductData from './ProductData.mjs';
const dataSource = new ProductData('tents');
const productList = new ProductList(
	'tents',
	dataSource,
	document.querySelector('.product-list'),
);

productList.init();
