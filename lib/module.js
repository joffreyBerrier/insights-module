const axios = require('axios')
const puppeteer = require('puppeteer')

async function speedInsightParser(options) {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  // go to google pagespeed for collectionist.com
  await page.goto(
    `https://developers.google.com/speed/pagespeed/insights/?hl=fr&url=${
      options.url
    }`
  )
  // wait to see tab
  await page.waitForSelector('.lh-gauge__percentage').then(test => {
    return
  })

  const result = await page.evaluate(() => {
    let percentages = Array.from(
      document.querySelectorAll('.lh-gauge__percentage')
    )
    // Field Data
    let fieldDatas = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap'
      )
    )
    let fieldDatasMetric = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap .metric-description'
      )
    )
    let fieldDatasMetricValue = Array.from(
      document.querySelectorAll(
        '.field-data.lh-category .field-metric.average.lh-metric__innerwrap .metric-value.lh-metric__value'
      )
    )
    // Laboratory data
    let laboratoryData = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric'
      )
    )
    let laboratoryDataMetric = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric .lh-metric__title'
      )
    )
    let laboratoryDataMetricValue = Array.from(
      document.querySelectorAll(
        '.lh-audit-group.lh-audit-group--metrics .lh-metric .lh-metric__value'
      )
    )
    // Opportunities
    let opportunities = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-load-opportunity__cols'
    )
    let opportunitiesMetric = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-load-opportunity__cols .lh-load-opportunity__col--one'
    )
    let opportunitiesMetricValue = document.querySelectorAll(
      '.lh-audit-group.lh-audit-group--load-opportunities .lh-load-opportunity__cols .lh-load-opportunity__col--two'
    )
    let resultPercentage = {}

    percentages.map((percentage, index) => {
      let type = index >= percentages.length / 2 ? 'desktop' : 'mobile'

      return (resultPercentage[type] = percentage.innerText)
    })

    let resultFieldData = {}

    for (let index = 0; index < fieldDatas.length; index++) {
      let type = index >= fieldDatas.length / 2 ? 'desktop' : 'mobile'
      const desc = fieldDatasMetric[index].innerText
      const value = fieldDatasMetricValue[index].innerText

      if (resultFieldData[type]) {
        resultFieldData[type] += `- ${desc}: *${value}* \n`
      } else {
        resultFieldData[type] = `- ${desc}: *${value}* \n`
      }
    }

    let resultLaboratoryData = {}

    for (let index = 0; index < laboratoryData.length; index++) {
      let type = index >= laboratoryData.length / 2 ? 'desktop' : 'mobile'
      const desc = laboratoryDataMetric[index].innerText
      const value = laboratoryDataMetricValue[index].innerText

      if (resultLaboratoryData[type]) {
        resultLaboratoryData[type] += `- ${desc}: *${value}* \n`
      } else {
        resultLaboratoryData[type] = `- ${desc}: *${value}* \n`
      }
    }

    let resultOpportunity = ''

    for (let index = 0; index < opportunities.length; index++) {
      const desc = opportunitiesMetric[index].innerText
      const value = opportunitiesMetricValue[index].innerText

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

async function sendSlackNotification(options) {
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

export default async function insights(options) {
  // https://api.slack.com/apps/A01B9RG0SG0/incoming-webhooks
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
