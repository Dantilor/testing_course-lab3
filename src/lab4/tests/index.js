const { describe, it, beforeEach, afterEach } = require('mocha')
const { Builder, Browser, By, until } = require('selenium-webdriver')
const fs = require('fs')
const MarketPage = require('../pages/Market.js')
const {assert} = require('chai');

describe('Market test', function() {
    let driver
    let marketPage

    beforeEach(async function() {
        driver = await new Builder().forBrowser(Browser.CHROME).build()
        marketPage = new MarketPage(driver)
        await marketPage.open()
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            const timestamp = new Date()
            const testCaseName = 'check tickets price'

            const screenshotFilename = `${testCaseName}_${timestamp.toLocaleDateString('ru-RU')}_${timestamp.getHours()}_${timestamp.getMinutes()}_${timestamp.getSeconds()}.png`

            const screenshot = await driver.takeScreenshot()
            fs.writeFileSync(screenshotFilename, screenshot, 'base64')

            console.error(`Тест упал по причине ошибки: ${this.currentTest.err.message}. Скриншот сохранен в файл: ${screenshotFilename}`)
        }
        await driver.quit()
    })

    it('check iphone score', async function() {
        const scoreNumber = await marketPage.checkScore()
        assert.isBelow(scoreNumber, 6, 'Рейтинг меньше 6')
    })

    it('check delivery', async function() {
        const deliveryTitleText = await marketPage.checkDelivery()
        assert.equal(deliveryTitleText, 'Доставка курьером, самовывоз — основные условия', 'есть в документе')
    })
})