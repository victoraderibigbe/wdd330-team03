// PLAIN ENGLISH: The web address of the SleepOutside server.
// LOGIC: First it tries VITE_SERVER_URL from the .env file. If that's missing, it uses the
//        backup address after the ||. Every request below starts with this address.
// WHY WE NEED IT: One address in one place. If the server moves, we change it once.
// LEARNING GAP: import.meta.env only works because Vite reads the .env file for us.
//               Without Vite, this would be undefined.
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend-osp8.onrender.com/';

// PLAIN ENGLISH: Checks the server's reply and turns it into usable JavaScript data.
// LOGIC: res.ok is true when the server says "success" (status 200-299). If so, .json()
//        converts the reply text into an object. If not, it throws an error.
// WHY WE NEED IT: Every request (products AND checkout) needs this same check, so it's
//                 written once and reused.
// LEARNING GAP: Next week's activity changes this to show the server's error details.
//               We're leaving it as is for now, because this week only needs A response.
function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

// PLAIN ENGLISH: The blueprint for everything that talks to the outside server.
// LOGIC: Renamed from ProductData, because it now SENDS orders too, not just gets products.
// WHY WE NEED IT: The assignment requires the rename to ExternalServices.
// LEARNING GAP: "export default" means other files import it WITHOUT curly braces:
//               import ExternalServices from './ExternalServices.mjs'
export default class ExternalServices {
  constructor() { }

  // PLAIN ENGLISH: Gets the list of products for one category (tents, backpacks, etc.).
  // LOGIC: A GET request to .../products/search/tents. The server's answer is wrapped in
  //        "Result," so we return data.Result.
  // WHY WE NEED IT: The product listing pages use this to show products.
  // LEARNING GAP: "await" pauses until the server answers. Without it, you'd get a
  //               Promise (an IOU) instead of the actual products.
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async findProductsByName(query, category) {
    const products = await this.getData(category);
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.NameWithoutBrand.toLowerCase().includes(searchTerm) ||
        product.Brand.Name.toLowerCase().includes(searchTerm),
    );
  }

  // PLAIN ENGLISH: Gets ONE product by its Id.
  // LOGIC: A GET request to .../product/880RR. Returns data.Result, like getData.
  // WHY WE NEED IT: The product detail page uses this to show one product.
  // LEARNING GAP: The address is "product" (singular) here, and "products" (plural) in
  //               getData. One missing "s" gives a failed request.
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  // PLAIN ENGLISH: NEW. Sends the finished order to the server.
  // LOGIC: 1) Build an "options" object that says: this is a POST, the data is JSON, and
  //           here is the data (turned into text with JSON.stringify).
  //        2) Send it to .../checkout with fetch(url, options).
  //        3) Return the server's answer.
  //        The order data (payload) comes from CheckoutProcess.mjs.
  // WHY WE NEED IT: The assignment says to POST the order to the server's checkout address.
  // LEARNING GAP: fetch() does a GET by default. To SEND data, you must pass a second
  //               argument with method: 'POST'. And the body must be TEXT, so we stringify
  //               the object. Sending the object itself arrives as "[object Object]."
  async checkout(payload) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    };
    const response = await fetch(`${baseURL}checkout`, options);
    return convertToJson(response);
  }
}
