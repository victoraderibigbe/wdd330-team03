import { loadHeaderFooter } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';
import ProductList from './ProductList.mjs';

async function init() {
  // Load the header and footer first.
  await loadHeaderFooter();

  const dataSource = new ExternalServices();

  const productList = new ProductList(
    'tents',
    dataSource,
    document.querySelector('.product-list'),
  );

  // Show all products when the page first loads.
  await productList.init();

  // Find the search form after the header has loaded.
  const searchForm = document.querySelector('#search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const searchInput = document.querySelector('#search-input');
      const query = searchInput.value.trim();

      // If search is empty, show all products again.
      if (!query) {
        await productList.init();
        return;
      }

      // Search the tents by product name or brand.
      const results = await dataSource.findProductsByName(query, 'tents');

      // Clear the old products and show the search results.
      productList.renderList(results, true);
    });
  }
}

init();
