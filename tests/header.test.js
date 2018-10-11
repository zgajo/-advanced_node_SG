const Page = require("./helpers/page");

let page;

beforeEach(async () => {
  page = await Page.build();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await page.close();
});

/**
 * TESTS
 */

test("We launch a browser and reading header title", async () => {
  const headerTitle = await page.evaluate(
    () => document.querySelector(".brand-logo").innerText
  );

  expect(headerTitle).toBe("Blogster");
});

test("Clicking login starts oauth flow", async () => {
  await page.click(".right a");
  const currUrl = await page.url();

  expect(currUrl).toMatch("oauth");
});

test("When authentificated and signed in shows logout button", async () => {
  await page.login();

  const logoutTitle = await page.evaluate(
    () => document.querySelector("a[href='/auth/logout']").innerText
  );

  expect(logoutTitle).toBe("Logout");
});
