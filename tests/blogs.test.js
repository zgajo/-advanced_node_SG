const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

describe("WHEN LOGGED IN", async () => {
  beforeEach(async () => {
    await page.login();
    await page.click("a[href='/blogs/new']");
  });

  test("Can se blog create form", async () => {
    // click and redirect to blogs form
    const blogsNew = await page.url();
    expect(blogsNew).toMatch("blogs/new");

    const label = await page.getElement("form label");
    expect(label).toEqual("Blog Title");
  });

  describe("And using valid inputs", async () => {
    const titleText = "My test title";
    const contentText = "My test content";

    beforeEach(async () => {
      await page.type(".title input", titleText);
      await page.type(".content input", contentText);
      await page.click("form button");
    });

    test("Submitting takes user to review screen", async () => {
      const text = await page.getElement("form h5");
      expect(text).toEqual("Please confirm your entries");
    });

    test("Submitting then saving adds blog to index page", async () => {
      await page.click("button.green");

      await page.waitFor(".card");

      const title = await page.getElement(".card-title");
      const content = await page.getElement("p");

      expect(title).toEqual(titleText);
      expect(content).toEqual(contentText);
    });
  });

  describe("And using invalid inputs", async () => {
    beforeEach(async () => {
      await page.click("form button");
    });

    test("The form shows invalid inputs", async () => {
      const titleErr = await page.getElement(".title .red-text");
      const contentErr = await page.getElement(".content .red-text");

      expect(titleErr).toEqual("You must provide a value");
      expect(contentErr).toEqual("You must provide a value");
    });
  });
});
