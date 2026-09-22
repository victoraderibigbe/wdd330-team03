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
        this.renderProductDetails(this.product);
        this.renderDiscount(this.product);

        document.getElementById('addToCart').addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        let itensCart = getLocalStorage('so-cart') || []; // get the current cart items from local storage, or initialize an empty array if none exist
        if (!itensCart.some((item) => item.Id === this.product.Id)) {
        // prevent adding duplicate items to the cart by checking if the product already exists in the cart
        itensCart.push({ ...this.product, Quantity: 1 });
        }else{
            itensCart = itensCart.map((item) => {
                
                if(item.Id === this.product.Id){
                    item.Quantity += 1;
                }
                return item;
            });
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
    renderProductDetails(product) {
        document.querySelector('h2').textContent = product.Brand.Name;
        document.querySelector('h3').textContent = product.NameWithoutBrand;

        const productImage = document.getElementById('productImage');
        productImage.src = product.Image;
        productImage.alt = product.NameWithoutBrand;

        document.getElementById('productPrice').textContent = product.FinalPrice;
        document.getElementById('productColor').textContent = product.Colors[0].ColorName;
        document.getElementById('productDesc').innerHTML = product.DescriptionHtmlSimple;

        document.getElementById('addToCart').dataset.id = product.Id;
        }

    renderDiscount(product) {
    const discountEl = document.getElementById('productDiscount');
    if (!discountEl) return;

    const original = product.SuggestedRetailPrice;
    const final = product.FinalPrice;

    if (original && original > final) {
        const savings = (original - final).toFixed(2);
        const percentOff = Math.round(((original - final) / original) * 100);

        discountEl.innerHTML = `
            <span class="product__original-price">$${original}</span>
            <span class="product__discount-badge">-${percentOff}% OFF</span>
            <span class="product__savings">You save $${savings}</span>
        `;
        discountEl.style.display = '';
    } else {
        discountEl.style.display = 'none'; // sin descuento, se oculta
    }
}
}