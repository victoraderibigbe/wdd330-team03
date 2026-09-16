import { loadHeaderFooter } from './utils.mjs';
import ShoppingCart from './ShoppingCart.mjs';

// This line exists so the header and footer show up on this
// page too, the same way we set it up elsewhere.
loadHeaderFooter();

// This mirrors how the product listing page works: create an
// instance of the class, pointing it at the right data and the
// right spot on the page, then call init() to display it.
const myCart = new ShoppingCart('so-cart', document.querySelector('.product-list'));
myCart.init();