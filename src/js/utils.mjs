// wrapper for querySelector...returns matching element
export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}
// or a more concise version if you are into that sort of thing:
// export const qs = (selector, parent = document) => parent.querySelector(selector);

// retrieve data from localstorage
export function getLocalStorage(key) {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  try {
    return JSON.parse(value);
  } catch (error) {
    // malformed/corrupted value (e.g. cleared to an empty string in DevTools)
    return null;
  }
}

// save data to local storage
export function setLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// set a listener for both touchend and click
export function setClick(selector, callback) {
  qs(selector).addEventListener('touchend', (event) => {
    event.preventDefault();
    callback();
  });
  qs(selector).addEventListener('click', callback);
}

export function getUrlParam(param) {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
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



// This function exists because every page needs the same header and footer,
// and instead of copying that HTML onto every page by hand, this function
// drops it into place automatically wherever it's needed.
export function renderWithTemplate(template, parentElement, data, callback) {
  parentElement.innerHTML = template;
  if (callback) {
    callback(data);
  }
}

// This function exists because the header and footer HTML live in their
// own separate files, and this function's job is to go fetch that file's
// content so it can be used elsewhere on the page.
export async function loadTemplate(path) {
  const res = await fetch(path);
  const template = await res.text();
  return template;
}

// This function exists to tie the two functions above together:
// it goes and gets the header and footer files, then places them
// into the empty header and footer spots on the page. This is the
// one function each page actually calls to make its header and
// footer show up.
export async function loadHeaderFooter() {
  const headerTemplate = await loadTemplate('/partials/header.html');
  const headerElement = document.querySelector('#main-header');
  renderWithTemplate(headerTemplate, headerElement);

  const footerTemplate = await loadTemplate('/partials/footer.html');
  const footerElement = document.querySelector('#main-footer');
  renderWithTemplate(footerTemplate, footerElement);
}