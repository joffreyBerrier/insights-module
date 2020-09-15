module.exports = {
  buildModules: [
    ['nuxt-insights', {
      webhookUrl: 'https://hooks.slack.com/services/******/*****/******',
      url: 'https://www.google.com/fr',
      fields: {
        notation: true,
        fieldData: false,
        laboratoryData: false,
        opportunities: false
      }
    }]
  ]
}
