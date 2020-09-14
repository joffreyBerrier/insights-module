const axios = require('axios')
const puppeteer = require('puppeteer')

const speedInsightParser = async (options) => {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  await page.goto(
    `https://developers.google.com/speed/pagespeed/insights/?hl=fr&url=${
      options.url
    }`
  )
  await page.waitForSelector('.lh-gauge__percentage').then(() => {
    return null
  })

  const result = await page.evaluate(() => {
    const percentages = Array.from(
      document.querySelectorAll('.lh-gauge__percentage')
    )
    // Field Data
    const fieldDatas = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap'
      )
    )
    const fieldDatasMetric = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap .metric-description'
      )
    )
    const fieldDatasMetricValue = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap .metric-value.lh-metric__value'
      )
    )
    // Laboratory data
    const laboratoryData = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric'
      )
    )
    const laboratoryDataMetric = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric .lh-metric__title'
      )
    )
    const laboratoryDataMetricValue = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric .lh-metric__value'
      )
    )
    // Opportunities
    const opportunities = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-audit.lh-audit--load-opportunity .lh-load-opportunity__cols'
    )
    const opportunitiesMetric = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-audit.lh-audit--load-opportunity .lh-load-opportunity__cols .lh-load-opportunity__col--one'
    )
    const opportunitiesMetricValue = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-audit.lh-audit--load-opportunity .lh-load-opportunity__cols .lh-load-opportunity__col--two'
    )
    const resultPercentage = {}

    percentages.map((percentage, index) => {
      const type = index >= percentages.length / 2 ? 'desktop' : 'mobile'

      return (resultPercentage[type] = percentage.textContent)
    })

    const resultFieldData = {}

    for (let index = 0; index < fieldDatas.length; index++) {
      const type = index >= fieldDatas.length / 2 ? 'desktop' : 'mobile'
      const desc = fieldDatasMetric[index].textContent
      const value = fieldDatasMetricValue[index].textContent

      if (resultFieldData[type]) {
        resultFieldData[type] += `- ${desc}: *${value}* \n`
      } else {
        resultFieldData[type] = `- ${desc}: *${value}* \n`
      }
    }

    const resultLaboratoryData = {}

    for (let index = 0; index < laboratoryData.length; index++) {
      const type = index >= laboratoryData.length / 2 ? 'desktop' : 'mobile'
      const desc = laboratoryDataMetric[index].textContent
      const value = laboratoryDataMetricValue[index].textContent

      if (resultLaboratoryData[type]) {
        resultLaboratoryData[type] += `- ${desc}: *${value}* \n`
      } else {
        resultLaboratoryData[type] = `- ${desc}: *${value}* \n`
      }
    }

    let resultOpportunity = ''

    for (let index = 0; index < opportunities.length; index++) {
      const desc = opportunitiesMetric[index].textContent.trim()
      const value = opportunitiesMetricValue[index].textContent.trim()

      resultOpportunity += `- ${desc}: *${value}* \n`
    }

    return {
      percentage: resultPercentage,
      fieldData: resultFieldData,
      laboratoryData: resultLaboratoryData,
      opportunities: resultOpportunity
    }
  })

  browser.close()

  return {
    mobilePercentage: result.percentage.mobile,
    mobileFieldData: result.fieldData.mobile,
    mobileLaboratoryData: result.laboratoryData.desktop,
    desktopPercentage: result.percentage.desktop,
    desktopFieldData: result.fieldData.desktop,
    desktopLaboratoryData: result.laboratoryData.desktop,
    opportunities: result.opportunities
  }
}

const sendSlackNotification = (options, message) => {
  axios.post(options.webhookUrl, {
    blocks: [
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: message
        }
      }
    ]
  })
}

export default async function insights (options) {
  if (this.options.dev) {
    return
  }

  const result = await speedInsightParser(options)
  const date = `${new Date().getDate()}/${new Date().getMonth()}/${new Date().getFullYear()}`
  // 0–49 - 50–89 - 90–100
  let iconMobile = ''
  let iconDesktop = ''

  if (Number(result.mobilePercentage) <= 49) {
    iconMobile = ':red_circle:'
  } else if (Number(result.mobilePercentage) <= 89) {
    iconMobile = ':orange_heart:'
  } else {
    iconMobile = ':green_heart:'
  }

  if (Number(result.desktopPercentage) <= 49) {
    iconDesktop = ':red_circle:'
  } else if (Number(result.desktopPercentage) <= 89) {
    iconDesktop = ':orange_heart:'
  } else {
    iconDesktop = ':green_heart:'
  }

  const message = `*Performance du site* _(${date})_ \n
  :iphone: | *Mobile* | *Score ${result.mobilePercentage}* ${iconMobile} \n\n
  *Field Data:* \n
  ${result.mobileFieldData} \n
  *Laboratory data:* \n
  ${result.mobileLaboratoryData} \n
  :computer: | *Desktop* | *Score ${
    result.desktopPercentage
  }* ${iconDesktop} \n\n
  *Field Data:* \n
  ${result.desktopFieldData} \n
  *Laboratory data:* \n
  ${result.desktopLaboratoryData} \n
  *Opportunities* \n
  ${result.opportunities}`

  await sendSlackNotification(options, message)
}

module.exports = insights
module.exports.meta = require('../package.json')
