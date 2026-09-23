import { loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

loadHeaderFooter();

const myCart = new ShoppingCart('so-cart', document.querySelector('.product-list'));
myCart.init();