// PLAIN ENGLISH: Bring in helper tools from our utils file.
// LOGIC: getLocalStorage reads saved data, renderListWithTemplate turns a list into HTML,
//        and qs is our shortcut for document.querySelector.
// WHY WE NEED IT: These tools already exist in utils.mjs, so we reuse them instead of rewriting them.
// LEARNING GAP: qs is new to this import list. If you forget to import a function,
//               you get "qs is not defined," even though it exists in utils.mjs.
import { getLocalStorage, renderListWithTemplate, qs } from './utils.mjs';

// PLAIN ENGLISH: A "fill-in-the-blanks" HTML card for one item in the cart.
// LOGIC: It takes one product object and plugs its details into the HTML using ${ }.
//        The data comes from localStorage ('so-cart'), which the product page saved
//        from the API. That's why the names have capital letters (Id, FinalPrice, Images).
// WHY WE NEED IT: The cart can hold any number of items, so we need one reusable card
//                 pattern instead of hand-writing HTML for each product.
// LEARNING GAP: The property names must match the API exactly. "finalPrice" (lowercase f)
//               shows "undefined" on the page, because the API calls it "FinalPrice."
function cartItemTemplate(item) {
  return `<li class='cart-card divider'>
  <button class='remove-button' data-id='${item.Id}' type='button'>X</button>
  <a href='#' class='cart-card__image'>
    <img
      src='${item.Images.PrimaryMedium}' 
      alt='${item.NameWithoutBrand}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.NameWithoutBrand}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: ${item.Quantity || 1}</p>
  <p class='cart-card__price'>$${item.FinalPrice}</p>
</li>`;
}

// PLAIN ENGLISH: The blueprint for the shopping cart page.
// LOGIC: cart.js creates one cart from this blueprint with: new ShoppingCart('so-cart', listElement).
// WHY WE NEED IT: Keeping all cart behavior in one class keeps the code organized,
//                 the same pattern as ProductList and ProductDetails.
// LEARNING GAP: "export default" means this is the main thing this file shares, so cart.js
//               imports it WITHOUT curly braces: import ShoppingCart from './ShoppingCart.mjs'.
export default class ShoppingCart {
  // PLAIN ENGLISH: Saves the two things the cart needs to remember.
  // LOGIC: key = the localStorage "drawer label" ('so-cart'); listElement = the <ul> on the page
  //        where cart cards go. Both are passed in from cart.js.
  // WHY WE NEED IT: Other methods use this.key and this.listElement, so we store them once here.
  // LEARNING GAP: "this" means "this particular cart." Without "this.", the other methods
  //               can't see these values.
  constructor(key, listElement) {
    this.key = key;
    this.listElement = listElement;
  }

  // PLAIN ENGLISH: Starts the cart: reads the saved items, shows them, and shows the total.
  // LOGIC: 1) Read the cart from localStorage. 2) If empty, show a message and hide the total.
  //        3) Otherwise, draw the cards, turn on the remove buttons, and show the total.
  // WHY WE NEED IT: This is the one method cart.js calls to make the whole page work.
  // LEARNING GAP: "|| []" means "if nothing is saved, use an empty list." getLocalStorage
  //               returns null for an empty cart, and null has no .length, so the page
  //               would crash without it.
  init() {
    const cartItems = getLocalStorage(this.key) || [];
    if (cartItems.length === 0) {
      this.listElement.innerHTML = `<li class='cart-empty-message'>Your cart is empty.</li>`;
      // NEW: hide the total box when the cart is empty (see displayCartTotal below).
      this.displayCartTotal(cartItems);
      return;
    }
    renderListWithTemplate(cartItemTemplate, this.listElement, cartItems, 'afterbegin', true);
    this.addRemoveListeners();
    // NEW: show the total once the items are on the page.
    this.displayCartTotal(cartItems);
  }

  // PLAIN ENGLISH: Adds up the cart and shows the total at the bottom of the page.
  // LOGIC: reduce() walks through every item and keeps a running total, starting at 0.
  //        For each item: price (FinalPrice) times how many (Quantity, or 1 if missing).
  //        If the cart is empty, the box stays hidden. If not, we fill in the number and un-hide it.
  // WHY WE NEED IT: The assignment says the cart must display a total before we build checkout.
  // LEARNING GAP: toFixed(2) rounds to 2 decimal places for money. Without it, math like
  //               39.99 + 229.99 can show as 269.97999999999996, which is a computer
  //               rounding quirk, not a bug in your math.
  displayCartTotal(cartItems) {
    const footer = qs('.cart-footer');

    if (cartItems.length === 0) {
      footer.hidden = true;
      return;
    }

    const total = cartItems.reduce(
      (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
      0,
    );

    qs('#cart-total-amount').textContent = total.toFixed(2);
    footer.hidden = false;
  }

  // PLAIN ENGLISH: Turns on every "X" remove button so clicking it removes that item.
  // LOGIC: Find all buttons with class "remove-button," then attach a click listener to each one.
  // WHY WE NEED IT: The buttons are created by JavaScript, so they need listeners added after
  //                 they exist on the page.
  // LEARNING GAP: We pass (event) => this.removeFromCart(event), a callback (from the Advanced
  //               Functions lesson). Writing this.removeFromCart(event) without the arrow would
  //               run it immediately instead of waiting for a click.
  addRemoveListeners() {
    const removeButtons = document.querySelectorAll('.remove-button');
    removeButtons.forEach((button) => {
      button.addEventListener('click', (event) => this.removeFromCart(event));
    });
  }

  // PLAIN ENGLISH: Removes the clicked item from the cart and redraws the page.
  // LOGIC: 1) Read the item's Id from the button's data-id. 2) Keep every item EXCEPT that one
  //        (filter). 3) Save the new list back to localStorage. 4) Run init() again to redraw,
  //        which also updates the total.
  // WHY WE NEED IT: Shoppers need to be able to change their minds.
  // LEARNING GAP: filter() doesn't delete anything; it builds a NEW list without the removed
  //               item. That's why we have to save the new list back to localStorage.
  removeFromCart(event) {
    const productId = event.target.dataset.id;
    const cartItems = getLocalStorage(this.key) || [];
    const newCartItems = cartItems.filter((item) => item.Id !== productId);
    localStorage.setItem(this.key, JSON.stringify(newCartItems));
    this.init();
  }
}