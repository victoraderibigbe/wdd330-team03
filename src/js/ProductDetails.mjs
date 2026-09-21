import { getLocalStorage, setLocalStorage } from './utils.mjs';

export default class ProductDetails {
    constructor(productId, dataSource) {
        this.productId = productId;
        this.dataSource = dataSource;
        this.product = {}
    }


    async init(){
        this.product = await this.dataSource.findProductById(this.productId);
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