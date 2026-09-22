import { renderListWithTemplate } from './utils.mjs';

function discountBadge(product) {
  const original = product.SuggestedRetailPrice;
  const final = product.FinalPrice;

  if (!original || original <= final) {
    return '';
  }

  const percentOff = Math.round(((original - final) / original) * 100);
  return `<span class="product-card__discount-badge">-${percentOff}%</span>`;
}

function productCardTemplate(product) {
  return `<li class="product-card">
    <a href="/product_pages/?product=${product.Id}">
      <div class="product-card__image-wrapper">
        <img src="${product.Images.PrimaryMedium}" alt="${product.NameWithoutBrand}" />
        ${discountBadge(product)}
      </div>
      <h3 class="card__brand">${product.Brand.Name}</h3>
      <h2 class="card__name">${product.NameWithoutBrand}</h2>
      <p class="product-card__price">$${product.FinalPrice}</p>
    </a>
  </li>`;
}

export default class ProductList {
  constructor(category, dataSource, listElement) {
    this.category = category;
    this.dataSource = dataSource;
    this.listElement = listElement;
  }

  async init() {
    const productList = await this.dataSource.getData(this.category);
    this.renderList(productList);
    document.querySelector('.title').textContent =
      this.category.charAt(0).toUpperCase() + this.category.slice(1);
  }

  renderList(list) {
    renderListWithTemplate(productCardTemplate, this.listElement, list);
  }
}