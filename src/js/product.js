import { getParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// This line exists so the header and footer show up on every
// product detail page too, the same way we set it up elsewhere.
loadHeaderFooter();


const dataSource = new ProductData('tents');

const productID = getParam('product');

const product = new ProductDetails(productID, dataSource);
product.init();

//   setLocalStorage('so-cart', itensCart);
// }
// add to cart button event handler
// async function addToCartHandler(e) {
//   const product = await dataSource.findProductById(e.target.dataset.id);
//   productDetails.addProductToCart(product);
// }

// // add listener to Add to Cart button
// document
//   .getElementById('addToCart')
//   .addEventListener('click', addToCartHandler);
