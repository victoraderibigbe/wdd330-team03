import { getLocalStorage, setLocalStorage, updateCartCount } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {};
    }

    async init() {
        this.product = await this.dataSource.findProductById(this.productId);
        this.renderProductDetails();
        this.renderDiscount(this.product);

        document.getElementById('add-to-cart').addEventListener('click', this.addProductToCart.bind(this));
    }

    addProductToCart() {
        let itensCart = getLocalStorage('so-cart') || [];
        if (!itensCart.some((item) => item.Id === this.product.Id)) {
            itensCart.push({ ...this.product, Quantity: 1 });
        } else {
            itensCart = itensCart.map((item) => {
                if (item.Id === this.product.Id) {
                    item.Quantity += 1;
                }
                return item;
            });
        }
        setLocalStorage('so-cart', itensCart);
         updateCartCount();
    }

    renderProductDetails() {
        productDetailsTemplate(this.product);
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
            discountEl.style.display = 'none';
        }
    }
}

function productDetailsTemplate(product) {
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