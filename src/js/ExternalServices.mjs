// PLAIN ENGLISH: The web address of the SleepOutside server.
// LOGIC: First it tries VITE_SERVER_URL from the .env file. If that's missing, it uses the
//        backup address after the ||. Every request below starts with this address.
// WHY WE NEED IT: One address in one place. If the server moves, we change it once.
// LEARNING GAP: import.meta.env only works because Vite reads the .env file for us.
//               Without Vite, this would be undefined.
const baseURL = import.meta.env.VITE_SERVER_URL || 'https://wdd330-backend-osp8.onrender.com/';

// PLAIN ENGLISH: Reads the server's reply, and if something went wrong, passes along the
//                server's full explanation instead of a vague "Bad Response."
// LOGIC: 1) Convert the reply body to JSON FIRST. The data comes from the server's response,
//           and when something fails, the server puts the error details in that body.
//        2) If res.ok is true (status 200-299), return the data.
//        3) If not, throw a custom object carrying the server's details in "message."
// WHY WE NEED IT: The W04 Individual Activity requires detailed error messages from the
//                 response body, so the shopper can see what to fix.
// LEARNING GAP: throw new Error() only accepts TEXT, but the server sends an OBJECT
//               (like { cardNumber: "Invalid Card Number" }). So we throw our own object with
//               the same "name" and "message" properties an Error has.
//               "async" is added because we now "await" res.json() inside this function.
//               The body must be read BEFORE throwing, or the details are lost.
async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw { name: 'servicesError', message: jsonResponse };
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

  // PLAIN ENGLISH: Sends the finished order to the server.
  // LOGIC: 1) Build an "options" object that says: this is a POST, the data is JSON, and
  //           here is the data (turned into text with JSON.stringify).
  //        2) Send it to .../checkout with fetch(url, options).
  //        3) Return the server's answer. If the server rejects the order, the error thrown
  //           by convertToJson passes up to CheckoutProcess.mjs, where it is caught.
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