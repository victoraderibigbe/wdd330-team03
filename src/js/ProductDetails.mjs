import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {}
    }


    async init(){
        this.product = await this.dataSource.findProductById(this.productId);
    // the product details are needed before rendering the HTML
    this.renderProductDetails();
    // once the HTML is rendered, add a listener to the Add to Cart button
    // Notice the .bind(this). This callback will not work if the bind(this) is missing. Review the readings from this week on "this" to understand why.
    document.getElementById('add-to-cart').addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        let itensCart = getLocalStorage('so-cart') || []; // get the current cart items from local storage, or initialize an empty array if none exist
        if (!itensCart.some((item) => item.Id === this.product.Id)) {
        // prevent adding duplicate items to the cart by checking if the product already exists in the cart
        itensCart.push(this.product);
        }
        setLocalStorage('so-cart', itensCart);
    }

    renderProductDetails() {
    productDetailsTemplate(this.product);
  }
}

function productDetailsTemplate(product) {
  // eslint-disable-next-line no-console
  document.querySelector('h2').textContent = product.Category.charAt(0).toUpperCase() + product.Category.slice(1);
  document.querySelector('#p-brand').textContent = product.Brand.Name;
  document.querySelector('#p-name').textContent = product.NameWithoutBrand;

  const productImage = document.querySelector('#p-image');
  productImage.src = product.Images.PrimaryLarge;
  productImage.alt = product.NameWithoutBrand;
  const euroPrice = new Intl.NumberFormat('de-DE',
    {
      style: 'currency', currency: 'EUR',
    }).format(Number(product.FinalPrice) * 0.85);
  document.querySelector('#p-price').textContent = `${euroPrice}`;
  document.querySelector('#p-color').textContent = product.Colors[0].ColorName;
  document.querySelector('#p-description').innerHTML = product.DescriptionHtmlSimple;

  document.querySelector('#add-to-cart').dataset.id = product.Id;
}