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
});
