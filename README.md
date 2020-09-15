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

Key                | Type       | Default   | Description
-------------------|------------|-----------|------------------------
  webhookUrl       | String     | Mandatory | The slack webhook url
  url              | String     | Mandatory | The url of the site you want to scan
  fields           | Object     |           |
  -notation        | Boolean    | true      | Score
  -fieldData       | Boolean    | true      | * **fieldData**
  -laboratoryData  | Boolean    | true      | * **laboratoryData**
  -opportunities   | Boolean    | true      | * **opportunities**

**fieldData**:
First Contentful Paint, First Input Delay (FID), Largest Contentful Paint (LCP), Cumulative Layout Shift (CLS)

**laboratoryData**:
First Contentful Paint, Time to Interactive, Speed Index, Total Blocking Time, Largest Contentful Paint, Cumulative Layout Shift

**opportunities**:
These suggestions can help your page load faster. However, they do not have a direct impact on the performance score.


## Example

```js
{
  buildModules: [
    ['nuxt-insights', {
      webhookUrl: 'https://hooks.slack.com/services/******/*****/******',
      url: 'https://www.google.com',
      // optional
      fields: {
        notation: true,
        fieldData: true,
        laboratoryData: true,
        opportunities: true
      }
    }]
  ]
}
```

<!-- ## Development

1. Clone this repository
2. Install dependencies using `yarn install` or `npm install` -->

## License

[MIT License](./LICENSE)

Copyright (c) Joffrey Berrier <joffrey.berrier@gmail.com>

<!-- Badges -->
[npm-version-src]: https://img.shields.io/npm/dt/nuxt-insights.svg?style=flat-square
[npm-version-href]: https://www.npmjs.com/package/nuxt-insights

[npm-downloads-src]: https://img.shields.io/npm/v/nuxt-insights/latest.svg?style=flat-square
[npm-downloads-href]: https://www.npmjs.com/package/nuxt-insights
