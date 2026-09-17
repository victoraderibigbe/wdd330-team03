import { getUrlParam, loadHeaderFooter } from './utils.mjs';
import ProductData from './ProductData.mjs';
import ProductDetails from './ProductDetails.mjs';

// This line exists so the header and footer show up on this
// page too, the same way we set it up on every other page.
loadHeaderFooter();

const dataSource = new ProductData();
const productId = getUrlParam('product');

const productDetails = new ProductDetails(productId, dataSource);
productDetails.init();

// function addProductToCart(product) {
//   let itensCart = getLocalStorage('so-cart') || []; // get the current cart items from local storage, or initialize an empty array if none exist
//   if (!itensCart.some((item) => item.Id === product.Id)) {
//     // prevent adding duplicate items to the cart by checking if the product already exists in the cart
//     itensCart.push(product);
//   }

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