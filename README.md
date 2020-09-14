# ⚡ @nuxtjs/insights

[![npm version][npm-version-src]][npm-version-href]
[![npm downloads][npm-downloads-src]][npm-downloads-href]

> Parse the result of PageSpeed Insights and send a slack notification

Ex:
```
Performance du site (13/8/2020)
:iphone: | Mobile | Score 14 :red_circle:
  Field Data:
    - First Contentful Paint (FCP): 2.8 s
    - Largest Contentful Paint (LCP): 3 s
    - First Contentful Paint (FCP): 2.4 s
    - First Contentful Paint (FCP): 2.4 s
 Laboratory data:
    - First Contentful Paint: 0,9 s
    - Speed Index: 2,5 s
    - Largest Contentful Paint: 2,3 s
    - Time to Interactive: 3,0 s
    - Total Blocking Time: 190 ms
    - Cumulative Layout Shift: 0,054

:computer: | Desktop | Score 72 :orange_heart:
  Field Data:
    - Largest Contentful Paint (LCP): 3.1 s
    - First Contentful Paint (FCP): 2.2 s
    - Largest Contentful Paint (LCP): 3.7 s
    - Cumulative Layout Shift (CLS): 0.14
  Laboratory data:
    - First Contentful Paint: 0,9 s
    - Speed Index: 2,5 s
    - Largest Contentful Paint: 2,3 s
    - Time to Interactive: 3,0 s
    - Total Blocking Time: 190 ms
    - Cumulative Layout Shift: 0,054

Opportunities
  - Supprimez les ressources JavaScript inutilisées: 3,5 s
  - Réduire le temps de réponse initial du serveur: 1,54 s
  - Différez le chargement des images hors écran: 0,3 s
  - Évitez d'utiliser de l'ancien code JavaScript dans les navigateurs récents: 0,3 s
  - Éliminez les ressources qui bloquent le rendu: 0,15 s
  - Supprimez les modules en double dans les groupes JavaScript: 0,15 s
  - Réduire le temps de réponse initial du serveur: 1,47 s
  - Supprimez les ressources JavaScript inutilisées: 0,55 s
```

## Setup

1. Add the `@nuxtjs/insights` dependency with `yarn` or `npm` to your project
2. Add `@nuxtjs/insights` to the `modules` section of `nuxt.config.js`
3. Configure it:

```js
{
  buildModules: [
    ['@nuxtjs/insights', {
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
[npm-version-src]: https://img.shields.io/npm/dt/@nuxtjs/insights.svg?style=flat-square
[npm-version-href]: https://npmjs.com/package/@nuxtjs/insights

[npm-downloads-src]: https://img.shields.io/npm/v/@nuxtjs/insights/latest.svg?style=flat-square
[npm-downloads-href]: https://npmjs.com/package/@nuxtjs/insights
