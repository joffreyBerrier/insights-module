# ⚡ nuxt-insights

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

## Description
Scan PageSpeed Insights of your website, send a slack notification with the result each time you deployed your application

#### Example of the slack notification:
<img src="https://github.com/joffreyBerrier/insights-module/blob/master/example/example.png" width="400">

## Slack
- Create an app on your slack: https://api.slack.com/apps?new_app=1
- Click on Incoming Webhooks and toggle On
- Add New Webhook to Workspace => Link your channel
- Copy the url of your webhook `https://hooks.slack.com/services/******/*****/******`

## Setup

1. Add the `nuxt-insights` dependency with `yarn` or `npm` to your project
2. Add `nuxt-insights` to the `buildModules` section of `nuxt.config.js`
3. Configure it:

Key                 | Type       | Description
--------------------|------------|-------------------------
  webhookUrl        | String     | The slack webhook url
  url               | String     | The url of the site you want to scan


```js
{
  buildModules: [
    ['nuxt-insights', {
      webhookUrl: 'https://hooks.slack.com/services/******/*****/******',
      url: 'https://www.google.com'
    }]
  ]
}
```

## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install`
3. Start development server using `npm run dev`

## License

[MIT License](./LICENSE)

Copyright (c) Joffrey Berrier <joffrey.berrier@gmail.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/nuxt-insights.svg?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/nuxt-insights

[npm-downloads-src]: https://img.shields.io/npm/v/nuxt-insights/latest.svg?style=flat-square
[npm-downloads-href]: https://www.npmjs.com/package/nuxt-insights
