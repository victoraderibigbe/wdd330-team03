export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
}

export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getParam(param) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const product = urlParams.get(param);
  return product;
}

export function renderListWithTemplate(
  templateFn,
  parentElement,
  list,
  position = 'afterbegin',
  clear = false,
) {
  if (clear) {
    parentElement.innerHTML = '';
  }
  const htmlStrings = list.map(templateFn);
  parentElement.insertAdjacentHTML(position, htmlStrings.join(''));
}

export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('../partials/header.html');
  const footerTemplate = await loadTemplate('../partials/footer.html');

  const headerElement = document.querySelector('#main-header');
  const footerElement = document.querySelector('#main-footer');

  renderWithTemplate(headerTemplate, headerElement, null, updateCartCount);
  renderWithTemplate(footerTemplate, footerElement);
}

export function updateCartCount() {
  const cartItems = getLocalStorage('so-cart') || [];
  const cartCountElement = document.getElementById('cart-count');
  if (cartCountElement) {
    cartCountElement.textContent = cartItems.length;
  }
}

// PLAIN ENGLISH: Shows a friendly message bar at the top of the page, with an X to close it.
// LOGIC: 1) Build a <div class="alert"> holding the message and an X.
//        2) Listen for clicks on it. If the X (a <span>) was clicked, remove the alert.
//        3) Add it to the TOP of <main> (prepend).
//        4) Scroll to the top so the shopper sees it (can be turned off with scroll = false).
//        The message comes from whoever calls this function. On checkout, it comes from the
//        server's error reply, passed along by CheckoutProcess.mjs.
// WHY WE NEED IT: The stretch goal asks for a non-intrusive popup (NOT alert()) for errors.
//                 It lives in utils because other pages can reuse it (like "Added to cart!").
// LEARNING GAP: "scroll = true" is a DEFAULT parameter: if the caller doesn't say, it scrolls.
//               e.target is the exact element clicked. Checking tagName === 'SPAN' means
//               only the X closes it, not clicking the message text.
export function alertMessage(message, scroll = true) {
  const main = document.querySelector('main');
  const alert = document.createElement('div');
  alert.classList.add('alert');
  alert.innerHTML = `<p>${message}</p><span>X</span>`;

  alert.addEventListener('click', function (e) {
    if (e.target.tagName === 'SPAN') {
      main.removeChild(this);
    }
  });

  main.prepend(alert);

  if (scroll) {
    window.scrollTo(0, 0);
  }
}

// PLAIN ENGLISH: Removes every alert currently on the page.
// LOGIC: Finds all elements with the class "alert" and removes each one.
// WHY WE NEED IT: If the shopper fixes one error and submits again, old messages shouldn't
//                 pile up. We clear them before showing new ones.
// LEARNING GAP: forEach with an arrow function is a callback, from this week's
//               Advanced Functions lesson.
export function removeAllAlerts() {
  document.querySelectorAll('.alert').forEach((alert) => alert.remove());
}