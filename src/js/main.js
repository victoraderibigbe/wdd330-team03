import ProductData from './ProductData.mjs';
import ProductList from './ProductList.mjs';
import { loadHeaderFooter } from './utils.mjs';

async function init() {
  // Load the shared header and footer first
  await loadHeaderFooter();

  // Load the products
  const dataSource = new ProductData('tents');
  const productList = new ProductList(
    'tents',
    dataSource,
    document.querySelector('.product-list'),
  );

  await productList.init();

  // Add discount indicators to discounted products
  async function addDiscountIndicators() {
    const products = await dataSource.getData();
    const productLinks = document.querySelectorAll('.product-list li a');

    productLinks.forEach((link) => {
      const image = link.querySelector('img');

      if (!image) return;

      const imagePath = image.getAttribute('src');
      const imageName = imagePath.split('/').pop();

      const product = products.find(
        (item) => item.Image && item.Image.includes(imageName),
      );

      if (
        product &&
        product.FinalPrice < product.SuggestedRetailPrice
      ) {
        const discount = Math.round(
          ((product.SuggestedRetailPrice - product.FinalPrice) /
            product.SuggestedRetailPrice) *
          100,
        );

        const badge = document.createElement('span');
        badge.classList.add('discount-badge');
        badge.textContent = `${discount}% OFF`;

        link.prepend(badge);
      }
    });
  }

  await addDiscountIndicators();

  // Handle product search
  const searchForm = document.querySelector('#search-form');

  if (searchForm) {
    searchForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const searchInput = document.querySelector('#search-input');
      const query = searchInput.value.trim();

      if (!query) {
        await productList.init();
        await addDiscountIndicators();
        return;
      }

      const results = await dataSource.findProductsByName(query);

      // Replace the current products with the search results
      productList.renderList(results, true);

      // Add discount badges to the search results
      await addDiscountIndicators();
    });
  }
}

init();
