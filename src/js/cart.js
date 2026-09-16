
import { getLocalStorage, setLocalStorage, loadHeaderFooter } from './utils.mjs';


// This line exists so the header and footer actually show up on this
// page too, the same way we set it up for the homepage.
loadHeaderFooter();

function renderCartContents() {
  const cartItems = getLocalStorage('so-cart') || [];

  if (cartItems.length === 0) {
    document.querySelector('.product-list').innerHTML = emptyCartTemplate();
    return;
  }

  const htmlItems = cartItems.map((item) => cartItemTemplate(item));
  document.querySelector('.product-list').innerHTML = htmlItems.join('');
  addRemoveListeners();
}

function emptyCartTemplate() {
  return `<li class='cart-empty-message'>Your cart is empty.</li>`;
}

function addRemoveListeners() {
  const removeButtons = document.querySelectorAll('.remove-button');
  removeButtons.forEach((button) => {
    button.addEventListener('click', removeFromCart);
  });
}

function removeFromCart(event) {
  const productId = event.target.dataset.id;
  const cartItems = getLocalStorage('so-cart') || [];
  const newCartItems = cartItems.filter((item) => item.Id !== productId);
  setLocalStorage('so-cart', newCartItems);
  renderCartContents();
}

function cartItemTemplate(item) {
  const newItem = `<li class='cart-card divider'>
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

  return newItem;
}

renderCartContents();
