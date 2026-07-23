const baseURL = import.meta.env.VITE_SERVER_URL;
//console.log("baseURL is:", baseURL);


async function convertToJson(res) {
  const jsonResponse = await res.json();
  if (res.ok) {
    return jsonResponse;
  } else {
    throw{ name: "servicesError", message: jsonResponse };
  }
}

export default class ExternalServices {
  constructor() {
    // this.categorProductData = category;
    // this.path = `/json/${this.category}.json`;
  }
  async getData(category) {
    const response = await fetch(`${baseURL}products/search/${category}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async findProductById(id) {
    const response = await fetch(`${baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }
  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };

    const response = await fetch(`${ baseURL }checkout`, options);
    return await convertToJson(response);
  }
}
