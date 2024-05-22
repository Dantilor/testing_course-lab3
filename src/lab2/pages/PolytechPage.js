const { Builder, By, until } = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')
const { writeFileSync } = require('fs')

const Locators = {
    OPEN_MENU_BTN: By.className('hamburger'),
    STUDENTS_LINK: By.xpath('//a[@title=\'Обучающимся\']'),
    SCHEDULE_LINK: By.xpath('//a[@title=\'Расписания\']'),
    SCHEDULE_PAGE_LINK: By.xpath('//a[@href=\'https://rasp.dmami.ru/\']'),
    SCHEDULE_INPUT: By.className('groups'),
    GROUP_SELECTION: By.id('221-321'),
    PARENT_ELEMENT: By.className('schedule-day'),
    SCHEDULE_DAY_TITLE: By.className('schedule-day__title'),
}

class PolytechPage {
    constructor() {
        this.base_url = 'https://mospolytech.ru/'
        let options = new chrome.Options()
        options.addArguments('--start-maximized')
        this.driver = new Builder()
            .forBrowser('chrome')
            .setChromeOptions(options)
            .build()
    }

    async findElement(locator, timeout = 2000) {
        return await this.driver
            .wait(until.elementLocated(locator), timeout)
            .catch(() => {
                throw new Error(`Can't find element by locator ${locator}`)
            })
    }

    async findElements(locator, timeout = 2000) {
        return await this.driver
            .wait(until.elementsLocated(locator), timeout)
            .catch(() => {
                throw new Error(`Can't find elements by locator ${locator}`)
            })
    }

    async startSession() {
        await this.driver.get(this.base_url)
    }

    async stopSession() {
        await this.driver.quit()
    }

    async takeScreenshot() {
        const image = await this.driver.takeScreenshot()
        const timestamp = new Date()
        const testCaseName = 'PolytechPage'
        const screenshotFilename = `${testCaseName}_${timestamp.toLocaleDateString('ru-RU')}_${timestamp.getHours()}_${timestamp.getMinutes()}_${timestamp.getSeconds()}.png`
        writeFileSync(screenshotFilename, image, 'base64')
        console.error(`Скриншот сохранен в файл: ${screenshotFilename}`)
    }

    async openMenu() {
        await (await this.findElement(Locators.OPEN_MENU_BTN)).click()
        await this.driver.sleep(1000)
        const studentsLinks = await this.findElements(Locators.STUDENTS_LINK)
        return studentsLinks.length
    }

    async navigateToSchedule() {
        const studentsLink = (await this.findElements(Locators.STUDENTS_LINK))[1]
        await this.driver
            .actions({ bridge: true })
            .move({ origin: studentsLink })
            .perform()
        await this.driver.sleep(1000)
        const scheduleLink = (await this.findElements(Locators.SCHEDULE_LINK))[0]
        await scheduleLink.click()
        await this.driver.sleep(1000)
        const schedulePageLink = (await this.findElements(Locators.SCHEDULE_PAGE_LINK))[0]
        await schedulePageLink.click()
        await this.driver.sleep(1000)
        return await this.driver.getTitle()
    }

    async checkSchedule() {
        const handles = await this.driver.getAllWindowHandles()
        await this.driver.switchTo().window(handles[1])
        await (await this.findElement(Locators.SCHEDULE_INPUT)).sendKeys('221-321')
        await (await this.findElement(Locators.GROUP_SELECTION)).click()
        await this.driver.sleep(1000)
    }


    async getScheduleByDay(day) {
        return await this.findElement(By.xpath(`//div[div[text()='${day}']]`))
    }
}

module.exports = PolytechPage
