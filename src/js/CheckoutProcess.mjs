// PLAIN ENGLISH: Bring in the tools this file needs.
// LOGIC: getLocalStorage reads the cart. alertMessage shows an error bar; removeAllAlerts
//        clears old error bars. ExternalServices sends the order to the server.
// WHY WE NEED IT: Reusing existing tools instead of rewriting them. The two alert tools are
//                 new this week, used in the catch block of checkout() below.
// LEARNING GAP: Named exports from utils.mjs go inside ONE set of curly braces, separated
//               by commas. ExternalServices has none (a default export). Mixing these up
//               gives "does not provide an export named..." errors.
import { getLocalStorage, alertMessage, removeAllAlerts } from './utils.mjs';
import ExternalServices from './ExternalServices.mjs';

// PLAIN ENGLISH: Creates one "messenger" for talking to the server.
// LOGIC: Made once, outside the class, then reused whenever an order is sent.
// WHY WE NEED IT: checkout() below uses services.checkout(...) to send the order.
// LEARNING GAP: A class is a blueprint. You must use "new" to create a usable object
//               from it before calling its methods.
const services = new ExternalServices();

// PLAIN ENGLISH: Turns the filled-in form into a plain object like { fname: "John", ... }.
// LOGIC: FormData reads every input in the form. forEach (a callback, from this week's
//        functions lesson) copies each input's "name" as the key and what was typed as the value.
// WHY WE NEED IT: The server wants an object, and this builds it from the form automatically.
// LEARNING GAP: This uses each input's NAME attribute, not its id. That's why the names in
//               checkout/index.html had to match the server's keys exactly.
function formDataToJSON(formElement) {
    const formData = new FormData(formElement);
    const convertedJSON = {};

    formData.forEach(function (value, key) {
        convertedJSON[key] = value;
    });

    return convertedJSON;
}

// PLAIN ENGLISH: Shrinks each big cart item down to only the 4 details the server needs.
// LOGIC: map() (a higher-order function) builds a NEW list. For each cart item, it keeps
//        id, name, price, and quantity. The data comes from localStorage ('so-cart'),
//        where the product page saved the full API product.
// WHY WE NEED IT: The assignment's order format only has id, name, price, and quantity.
// LEARNING GAP: The cart uses capital letters (Id, Name, FinalPrice) because that's how the
//               API names them. The server wants lowercase (id, name, price). This function
//               translates between the two. "Quantity || 1" matches the rule used in the cart.
function packageItems(items) {
    return items.map((item) => ({
        id: item.Id,
        name: item.Name,
        price: item.FinalPrice,
        quantity: item.Quantity || 1,
    }));
}

// PLAIN ENGLISH: The blueprint for the checkout page's math and order sending.
// LOGIC: checkout.js creates one with: new CheckoutProcess('so-cart', '#order-summary').
// WHY WE NEED IT: The assignment requires a default-exported CheckoutProcess class.
// LEARNING GAP: Same pattern as ShoppingCart and ProductList: constructor saves settings,
//               init() starts things, helper methods do the work.
export default class CheckoutProcess {
    // PLAIN ENGLISH: Saves the settings and sets every money amount to 0 to start.
    // LOGIC: key = 'so-cart' (the localStorage label). outputSelector = '#order-summary'
    //        (the box where amounts are shown).
    // WHY WE NEED IT: The methods below read and update these values.
    // LEARNING GAP: Starting at 0 means the page shows $0.00 instead of "undefined" before
    //               the math runs.
    constructor(key, outputSelector) {
        this.key = key;
        this.outputSelector = outputSelector;
        this.list = [];
        this.itemTotal = 0;
        this.numItems = 0;
        this.shipping = 0;
        this.tax = 0;
        this.orderTotal = 0;
    }

    // PLAIN ENGLISH: Starts the checkout page: reads the cart and shows the subtotal.
    // LOGIC: Reads the cart from localStorage, then runs calculateItemSubTotal().
    // WHY WE NEED IT: The assignment says the subtotal must show when the page loads.
    // LEARNING GAP: The instructions' example calls "calculateItemSummary" here, but the
    //               method is named calculateItemSubTotal. The names must match, or you get
    //               "is not a function." We fixed that mismatch here.
    init() {
        this.list = getLocalStorage(this.key) || [];
        this.calculateItemSubTotal();
    }

    // PLAIN ENGLISH: Adds up the cart items and shows the item count and subtotal.
    // LOGIC: reduce() keeps a running total. Price = FinalPrice x quantity. Count = quantities
    //        added up. Then each number is typed into its slot (#num-items, #subtotal).
    // WHY WE NEED IT: Required by the assignment, and tax and shipping are based on these numbers.
    // LEARNING GAP: `${this.outputSelector} #subtotal` becomes "#order-summary #subtotal,"
    //               meaning "the #subtotal INSIDE the summary box." That's the pattern from
    //               the instructions' example.
    calculateItemSubTotal() {
        this.itemTotal = this.list.reduce(
            (sum, item) => sum + item.FinalPrice * (item.Quantity || 1),
            0,
        );
        this.numItems = this.list.reduce((count, item) => count + (item.Quantity || 1), 0);

        document.querySelector(`${this.outputSelector} #num-items`).textContent = this.numItems;
        document.querySelector(`${this.outputSelector} #subtotal`).textContent =
            `$${this.itemTotal.toFixed(2)}`;
    }

    // PLAIN ENGLISH: Works out tax, shipping, and the final total, then shows them.
    // LOGIC: Tax = 6% of the subtotal (x 0.06). Shipping = $10 for the first item, plus $2 for
    //        each extra item. If the cart is empty, shipping is $0. Total = subtotal + tax + shipping.
    // WHY WE NEED IT: The assignment gives these exact formulas and says to run this after the
    //                 zip code is filled in.
    // LEARNING GAP: (numItems - 1) x 2 is the "each ADDITIONAL item" part. 2 items = 10 + 2 = $12.
    //               Writing numItems x 2 would overcharge by $2.
    calculateOrderTotal() {
        this.tax = this.itemTotal * 0.06;
        this.shipping = this.numItems > 0 ? 10 + (this.numItems - 1) * 2 : 0;
        this.orderTotal = this.itemTotal + this.tax + this.shipping;

        this.displayOrderTotals();
    }

    // PLAIN ENGLISH: Types the tax, shipping, and order total into the summary box.
    // LOGIC: Finds each slot inside #order-summary and fills it with a $ amount.
    // WHY WE NEED IT: Keeps "doing math" and "showing results" as separate jobs.
    // LEARNING GAP: toFixed(2) is for DISPLAY only. It turns the number into text, so we don't
    //               use its result for more math.
    displayOrderTotals() {
        document.querySelector(`${this.outputSelector} #tax`).textContent =
            `$${this.tax.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #shipping`).textContent =
            `$${this.shipping.toFixed(2)}`;
        document.querySelector(`${this.outputSelector} #order-total`).textContent =
            `$${this.orderTotal.toFixed(2)}`;
    }

    // PLAIN ENGLISH: Builds the order, sends it, then either goes to the success page or shows
    //                the server's error messages.
    // LOGIC: 1) Calculate totals. 2) Build the order object from the form + cart.
    //        3) TRY sending it. If it works: empty the cart and go to the success page.
    //        4) If it fails (CATCH): clear old alerts, then show each message the server sent.
    //        The error details come from the server's reply, passed up by convertToJson
    //        in ExternalServices.mjs.
    // WHY WE NEED IT: The W04 Individual Activity requires catching the error here (where the
    //                 form lives), a success page, and clearing the cart on success.
    // LEARNING GAP: The server's error details arrive as an OBJECT, like
    //               { cardNumber: "Invalid Card Number", expiration: "Card expired" }.
    //               "for...in" loops through each key so every problem gets its own alert.
    //               We check typeof === 'object' in case the error is something else (like no
    //               internet), which gets a general message instead.
    //               The success page path starts with "/" so it works whether the address
    //               ends in "/checkout/" or "/checkout".
    async checkout(form) {
        this.calculateOrderTotal();

        const order = formDataToJSON(form);
        order.orderDate = new Date().toISOString();
        order.orderTotal = this.orderTotal.toFixed(2);
        order.tax = this.tax.toFixed(2);
        order.shipping = this.shipping;
        order.items = packageItems(this.list);

        try {
            const response = await services.checkout(order);
            console.log('Server response:', response);

            // Happy path: empty the cart, then go to the success page.
            localStorage.removeItem(this.key);
            location.assign('/checkout/success.html');
            return response;
        } catch (err) {
            // Unhappy path: clear old messages, then show what went wrong.
            removeAllAlerts();

            if (err.name === 'servicesError' && typeof err.message === 'object') {
                for (const key in err.message) {
                    alertMessage(err.message[key]);
                }
            } else {
                alertMessage('Something went wrong placing your order. Please try again.');
            }

            console.log('Checkout error:', err);
        }
    }
}