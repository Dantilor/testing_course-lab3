const { describe, it, beforeEach, afterEach } = require('mocha')
const { Builder, Browser } = require('selenium-webdriver')
const MarketPage = require('../pages/YandexMarket.js')
const fs = require('fs')
const assert = require('assert')

describe('Markets Test Suite', function() {
    let driver
    let marketPage
    this.timeout(90000)
    beforeEach(async function() {
        driver = await new Builder().forBrowser(Browser.CHROME).build()
        marketPage = new MarketPage(driver)
        await marketPage.open()
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            const timestamp = new Date()
            const testCaseName = 'get_samsung_gaming_phones'

            const screenshotFilename = `${testCaseName}_${timestamp.toLocaleDateString('ru-RU')}_${timestamp.getHours()}_${timestamp.getMinutes()}_${timestamp.getSeconds()}.png`

            const screenshot = await driver.takeScreenshot()
            fs.writeFileSync(screenshotFilename, screenshot, 'base64')

            console.error(`Тест упал по причине ошибки: ${this.currentTest.err.message}. Скриншот сохранен в файл: ${screenshotFilename}`)
        }
        await driver.quit()
    })

    it('get_samsung_gaming_phones', async function() {
        await marketPage.navigateToGamingPhones()

        await driver.sleep(3000)
        const firstFiveProducts = await marketPage.getFirstFiveProducts()
        console.log('Первые пять товаров:')
        console.log(firstFiveProducts)
        await marketPage.setSamsungManufacturer()
        await driver.sleep(3000)
        console.log('Первые пять товаров Samsung:')
        const firstFiveFilteredProducts = await marketPage.getFirstFiveProducts()
        console.log(firstFiveFilteredProducts)
        assert.equal(marketPage.isSamsungProducts(firstFiveFilteredProducts), true, "Товары должны быть компании самсунг")
    })
})