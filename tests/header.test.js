const puppeteer = require("puppeteer");

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

test("Adds 2 nums", () => {
  const sum = 1 + 1;
  expect(sum).toEqual(2);
});

test("We launch a browser and reading header title", async () => {
  const headerTitle = await page.evaluate(
    () => document.querySelector(".brand-logo").innerText
  );

  expect(headerTitle).toBe("Blogster");
});
