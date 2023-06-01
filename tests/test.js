const { Builder, By, Key, until } = require('selenium-webdriver');
const firefox = require('selenium-webdriver/firefox');
const percySnapshot = require('@percy/selenium-webdriver');
const httpServer = require('http-server');
const spawn = require('child_process').spawn;
const server = httpServer.createServer();

const PORT = process.env.PORT_NUMBER || 8000;
const TEST_URL = `http://localhost:${PORT}`;

async function cleanup({ driver, server, isError = 0 }) {
  driver && (await driver.quit());
  server && server.close();

  process.exit(isError);
}

(async function() {
  let driver;

  try {
    driver = await new Builder()
      .forBrowser('firefox').setFirefoxOptions(
        new firefox.Options().headless()
      ).build();

    async function emptyTodos() {
      await driver.get(TEST_URL);
      await driver.wait(until.titleIs('VanillaJS • TodoMVC'), 1000);
      await percySnapshot(driver, 'Empty Todos');
    }

    async function newTodo() {
      await driver.get(TEST_URL);
      await driver.wait(until.titleIs('VanillaJS • TodoMVC'), 1000);

      await driver.findElement(By.className('new-todo')).sendKeys('Write tests', Key.ENTER);
      await percySnapshot(driver, 'New todo');
    }

    async function completeTodo() {
      await driver.get(TEST_URL);
      await driver.wait(until.titleIs('VanillaJS • TodoMVC'), 1000);

      await driver.findElement(By.css('.todo-list li:first-child .toggle')).click();
      await percySnapshot(driver, 'Completed todo');
    }

    await emptyTodos();
    await newTodo();
    await completeTodo();
  } catch (error) {
    console.log(error);
    await cleanup({ driver, server, isError: 1 });
  } finally {
    await cleanup({ driver, server });
  }
})();
