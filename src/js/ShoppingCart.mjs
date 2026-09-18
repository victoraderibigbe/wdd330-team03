import { getLocalStorage, renderListWithTemplate } from './utils.mjs';

// This template function builds the HTML for one cart item. It's the
// same idea as productCardTemplate in ProductList.mjs - one function,
// one item, reused for every item in the list.
function cartItemTemplate(item) {
    return `<li class='cart-card divider'>
  <button class='remove-button' data-id='${item.Id}' type='button'>X</button>
  <a href='#' class='cart-card__image'>
    <img
      src='${item.Image}'
      alt='${item.Name}'
    />
  </a>
  <a href='#'>
    <h2 class='card__name'>${item.Name}</h2>
  </a>
  <p class='cart-card__color'>${item.Colors[0].ColorName}</p>
  <p class='cart-card__quantity'>qty: 1</p>
  <p class='cart-card__price'>$${item.FinalPrice}</p>
</li>`;
}

// This class exists to organize all the cart page's logic into one
// place, the same way ProductList organizes the product listing
// page's logic. Before this, cart.js had a mix of loose functions;
// now that logic lives in one reusable class.
export default class ShoppingCart {
    constructor(key, listElement) {
        this.key = key;
        this.listElement = listElement;
    }

    init() {
        const cartItems = getLocalStorage(this.key) || [];

        if (cartItems.length === 0) {
            this.listElement.innerHTML = `<li class='cart-empty-message'>Your cart is empty.</li>`;
            return;
        }

        renderListWithTemplate(cartItemTemplate, this.listElement, cartItems);
        this.addRemoveListeners();
    }

    addRemoveListeners() {
        const removeButtons = document.querySelectorAll('.remove-button');
        removeButtons.forEach((button) => {
            button.addEventListener('click', (event) => this.removeFromCart(event));
        });
    }

    removeFromCart(event) {
        const productId = event.target.dataset.id;
        const cartItems = getLocalStorage(this.key) || [];
        const newCartItems = cartItems.filter((item) => item.Id !== productId);
        localStorage.setItem(this.key, JSON.stringify(newCartItems));
        this.init();
    }
}