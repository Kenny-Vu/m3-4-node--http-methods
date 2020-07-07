const { customers, stock } = require("./promo");

class verification {
  constructor() {
    this.country = "Canada";
  }
  checkCountry = (country) => {
    return country === this.country ? true : false;
  };
  checkName = (givenName, surName) => {
    return customers.some((customer) => {
      return givenName === customer.givenName && surName === customer.surname;
    });
  };
  checkEmail = (email) => {
    return customers.some((customer) => {
      return email === customer.email;
    });
  };
  checkAddress = (address, country) => {
    return customers.some((customer) => {
      return address === customer.address && country !== this.country;
    });
  };
  checkStock = (order, size) => {
    if (order === "shirt") {
      const shirtSize = size;
      return stock.shirt[`${shirtSize}`] > 0;
    } else {
      return stock[`${order}`] > 0;
    }
  };
  checkSize = (order, size) => {
    if (order === "shirt") {
      return size === "undefined";
    }
  };
}

const doubleCheck = new verification();

module.exports = { doubleCheck };
