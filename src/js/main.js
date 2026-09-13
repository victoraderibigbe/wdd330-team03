import ProductData from './ProductData.mjs';

const dataSource = new ProductData('tents');

async function addDiscountIndicators() {
  const products = await dataSource.getData();
  const productLinks = document.querySelectorAll('.product-list li a');

  productLinks.forEach((link) => {
    const image = link.querySelector('img');

    if (!image) return;

    const imagePath = image.getAttribute('src');
    const imageName = imagePath.split('/').pop();

    const product = products.find(
      (item) => item.Image && item.Image.includes(imageName)
    );

    if (
      product &&
      product.FinalPrice < product.SuggestedRetailPrice
    ) {
      const discount = Math.round(
        ((product.SuggestedRetailPrice - product.FinalPrice) /
          product.SuggestedRetailPrice) *
        100
      );

      const badge = document.createElement('span');
      badge.classList.add('discount-badge');
      badge.textContent = `${discount}% OFF`;

      link.prepend(badge);
    }
  });
}

addDiscountIndicators();
