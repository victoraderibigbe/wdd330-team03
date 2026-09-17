// This line exists to grab the server address we set up in the .env
// file. Using an environment variable like this means the app can
// point at a different server for testing vs. the real live site,
// without changing this code every time.
const baseURL = import.meta.env.VITE_SERVER_URL;

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  // The category is no longer set once when this class is created -
  // instead, it gets passed in fresh each time getData() is called.
  // This makes one ProductData object flexible enough to fetch any
  // category, instead of being locked into just one.
  constructor() { }

  // This is now async, and fetches from the real API server instead
  // of a local JSON file. The category (tents, backpacks, etc.) is
  // inserted directly into the URL we're asking the server for.
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    // The data coming back from the API is structured differently
    // than the old local JSON files were - the actual list of
    // products lives inside a property called "Result".
    return data.Result;
  }

  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
}