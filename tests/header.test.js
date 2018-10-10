const puppeteer = require("puppeteer");
const sessionFactory = require("../tests/factories/sessionFactory");

let page, browser;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false
  });
  page = await browser.newPage();
  await page.goto("localhost:3000");
});

afterEach(async () => {
  await browser.close();
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
  // Simulate cookie-session module
  const { session, sig } = sessionFactory();
  // End

  await page.setCookie({ name: "session", value: session });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");

  // Waits for element to show up
  await page.waitFor("a[href='/auth/logout']");

  const logoutTitle = await page.evaluate(
    () => document.querySelector("a[href='/auth/logout']").innerText
  );

  expect(logoutTitle).toBe("Logout");
});
