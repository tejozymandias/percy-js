const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const percySnapshot = require('@percy/selenium-webdriver');

(async function() {
  let driver;

  try {
    driver = await new Builder()
      .forBrowser('firefox').setFirefoxOptions(
        new firefox.Options()
      ).build();
      driver.manage().window().maximize(); 

    async function firstScreenshot() {
      await driver.get("https://www.browserstack.com/");
      await percySnapshot(driver, 'firstScreenshot');
    }

    async function secondScreenshot() {
      await driver.get("https://www.browserstack.com/pricing");
      await percySnapshot(driver, 'secondScreenshot');
    }

    async function thirdScreenshot() {
      await driver.get("https://www.browserstack.com/integrations/automate");
      await percySnapshot(driver, 'thirdScreenshot');
    }

    async function fourthScreenshot() {
        await driver.get("https://www.browserstack.com/docs");
        await percySnapshot(driver, 'fourthScreenshot');
      }

    await firstScreenshot();
    await secondScreenshot();
    await thirdScreenshot();
    await fourthScreenshot();
  } catch (error) {
    console.log(error);
  } 
})();
