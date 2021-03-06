const puppeteer = require("puppeteer");
const sessionFactory = require("../factories/sessionFactory");
const userFactory = require("../factories/userFactory");

class CustomPage {
  constructor(page) {
    this.page = page;
  }

  static async build() {
    const browser = await puppeteer.launch({
      headless: true,
      args: ["--no-sandbox"]
    });

    const page = await browser.newPage();
    const customPage = new CustomPage(page);

    return new Proxy(customPage, {
      get: function(target, property) {
        return customPage[property] || browser[property] || page[property];
      }
    });
  }

  async getElement(el) {
    return this.page.$eval(el, el => el.innerHTML);
  }

  async login() {
    // Simulate cookie-session module
    const user = await userFactory();
    const { session, sig } = sessionFactory(user);
    // End

    await this.page.setCookie({ name: "session", value: session });
    await this.page.setCookie({ name: "session.sig", value: sig });
    await this.page.goto("http://localhost:3000/blogs");

    // Waits for element to show up
    await this.page.waitFor("a[href='/auth/logout']");
  }

  async get(path) {
    return await this.page.evaluate(_path => {
      return fetch(_path, {
        method: "GET",
        credentials: "same-origin",
        headers: {
          "Content-Type": "application/json"
        }
      }).then(res => res.json());
    }, path);
  }

  async post(path, objToSend) {
    return await this.page.evaluate(
      (_path, _objToSend) => {
        return fetch(_path, {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(_objToSend)
        }).then(res => res.json());
      },
      path,
      objToSend
    );
  }

  execRequests(actions) {
    return Promise.all(
      actions.map(({ method, path, data }) => {
        return this[method](path, data);
      })
    );
  }
}

module.exports = CustomPage;
