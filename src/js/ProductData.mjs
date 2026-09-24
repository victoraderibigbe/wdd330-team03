function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error('Bad Response');
  }
}

export default class ProductData {
  constructor(category) {
    this.category = category;
    this.path = `/json/${this.category}.json`;
  }
  getData() {
    return fetch(this.path)
      .then(convertToJson)
      .then((data) => data);
  }
  async findProductById(id) {
    const products = await this.getData();
    return products.find((item) => item.Id === id);
  }

  async findProductsByName(query) {
    const products = await this.getData();
    const searchTerm = query.toLowerCase().trim();

    return products.filter(
      (product) =>
        product.NameWithoutBrand.toLowerCase().includes(searchTerm) ||
        product.Brand.Name.toLowerCase().includes(searchTerm),
    );
  }
}
