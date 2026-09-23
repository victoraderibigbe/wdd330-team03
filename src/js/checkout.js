// PLAIN ENGLISH: Bring in the header/footer loader and the CheckoutProcess blueprint.
// LOGIC: loadHeaderFooter is a named export (curly braces). CheckoutProcess is a default export.
// WHY WE NEED IT: This file is the "on switch" for the checkout page.
// LEARNING GAP: Same pattern as cart.js: small page files just connect the pieces.
import { loadHeaderFooter } from './utils.mjs';
import CheckoutProcess from './CheckoutProcess.mjs';

// PLAIN ENGLISH: Shows the shared header and footer on this page.
// LOGIC: Fills in #main-header and #main-footer from the partials folder.
// WHY WE NEED IT: Every page uses the same header and footer.
// LEARNING GAP: This line was already here. We kept it.
loadHeaderFooter();

// PLAIN ENGLISH: Creates the checkout process and shows the subtotal right away.
// LOGIC: 'so-cart' = where the cart is saved. '#order-summary' = where amounts are shown.
//        init() reads the cart and fills in Items and Subtotal.
// WHY WE NEED IT: The assignment says the subtotal shows when the page loads.
// LEARNING GAP: 'so-cart' must match the key the cart page uses, or checkout sees an empty cart.
const order = new CheckoutProcess('so-cart', '#order-summary');
order.init();

// PLAIN ENGLISH: When the shopper leaves the zip code box, calculate tax, shipping, and total.
// LOGIC: "blur" means "the shopper clicked or tabbed OUT of this box."
// WHY WE NEED IT: The assignment says this math runs after the zip code is filled in.
// LEARNING GAP: We pass () => order.calculateOrderTotal(), a callback. Writing
//               order.calculateOrderTotal() without the arrow would run it immediately
//               on page load, not when the zip box is left.
document.querySelector('#zip').addEventListener('blur', () => order.calculateOrderTotal());

// PLAIN ENGLISH: When the form is submitted, send the order instead of reloading the page.
// LOGIC: The browser checks every "required" box FIRST. The submit event only happens if all
//        are filled in. preventDefault() stops the reload, then checkout() sends the order.
// WHY WE NEED IT: The assignment requires preventDefault and sending the order with JavaScript.
// LEARNING GAP: We listen for "submit" on the FORM, not "click" on the button. That way,
//               pressing Enter also works, and the "required" check still happens.
document.querySelector('#checkout-form').addEventListener('submit', (event) => {
    event.preventDefault();
    order.checkout(event.target);
});