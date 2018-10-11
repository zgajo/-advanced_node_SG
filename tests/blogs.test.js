const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

test("When logged in, can se blog create form", async () => {
  // login and check if we're on the blogs list
  await page.login();

  const currUrl = await page.url();
  expect(currUrl).toMatch("blogs");

  // click and redirect to blogs form
  await page.click("a[href='/blogs/new']");
  const blogsNew = await page.url();
  expect(blogsNew).toMatch("blogs/new");

  const label = await page.getElement("form label");
  expect(label).toEqual("Blog Title");
});
