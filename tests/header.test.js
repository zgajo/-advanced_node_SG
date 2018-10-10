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

test.only("When authentificated and signed in shows logout button", async () => {
  // Simulate cookie-session module
  const id = "5bbc76be5b2aa949c6065da2";

  const Buffer = require("safe-buffer").Buffer;
  const sessionObj = {
    passport: {
      user: id
    }
  };

  const sessionString = Buffer.from(JSON.stringify(sessionObj)).toString(
    "base64"
  );

  const Keygrip = require("keygrip");
  const keys = require("../config/keys");

  const keygrip = new Keygrip([keys.cookieKey]);
  const sig = keygrip.sign("session=" + sessionString);
  // End

  await page.setCookie({ name: "session", value: sessionString });
  await page.setCookie({ name: "session.sig", value: sig });
  await page.goto("localhost:3000");

  await page.waitFor("a[href='/auth/logout']");

  const logoutTitle = await page.evaluate(
    () => document.querySelector("a[href='/auth/logout']").innerText
  );

  expect(logoutTitle).toBe("Logout");
});
