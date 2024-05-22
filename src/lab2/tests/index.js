const { describe, it, before, after, afterEach } = require('mocha')
const PolytechPage = require('../pages/PolytechPage.js')
const assert = require('assert')

describe('MyPage Tests', function() {
    let page
    this.timeout(30000)

    before(async function() {
        page = new PolytechPage()
        await page.startSession()
    })

    after(async function() {
        await page.stopSession()
    })

    afterEach(async function() {
        if (this.currentTest.state === 'failed') {
            await page.takeScreenshot()
        }
    })

    it('should open menu and return number of students links', async function() {
        let numStudentsLinks = await page.openMenu()
        assert.strictEqual(numStudentsLinks, 3)
    })

    it('should navigate to schedule page and return page title', async function() {
        let pageTitle = await page.navigateToSchedule()
        assert.strictEqual(pageTitle, 'Расписания')
    })

    it('should check schedule', async function() {
        await page.checkSchedule()
    })

    it('should get schedule day and compare with current day', async function() {
        let weekdays = [
            'Воскресенье',
            'Понедельник',
            'Вторник',
            'Среда',
            'Четверг',
            'Пятница',
            'Суббота',
        ]
        let currentWeekday = new Date().getDay()
        console.log(weekdays[currentWeekday])
        let scheduleDay = await page.getScheduleByDay(weekdays[currentWeekday])
        const elemClasses = await scheduleDay.getAttribute('class')
        assert.equal(elemClasses.includes('schedule-day_today'), true)
    })
})
