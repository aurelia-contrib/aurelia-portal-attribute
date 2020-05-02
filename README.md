# aurelia-portal-attribute

[![Join the chat at https://gitter.im/aurelia/discuss](https://badges.gitter.im/Join%20Chat.svg)](https://gitter.im/aurelia/discuss?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)
[![CircleCI](https://circleci.com/gh/bigopon/aurelia-portal-attribute.svg?style=svg)](https://circleci.com/gh/bigopon/aurelia-portal-attribute)

## [Introduction]

This article covers the portal attribute plugin for Aurelia. This plugin is created for managing rendering flow of part of custom element in an Aurelia application. The plugin supports the use of dynamic elements matching as render target, via either element references or CSS selectors. [Online Demo](http://aurelia-portal.bigopon.surge.sh/)


## [Installing The Plugin]

1. In your **JSPM**-based project install the plugin via `jspm` with following command

```shell
jspm install aurelia-portal-attribute
```

If you use **Webpack**, install the plugin with the following command

```shell
npm install aurelia-portal-attribute --save
```

If you use the **Aurelia CLI**, install the plugin with the following command

```shell
au install aurelia-portal-attribute
```

alternatively you can manually add these dependencies to your vendor bundle:

```json
  ...
  "dependencies": [
    {
      "name": "aurelia-portal-attribute",
      "path": "../node_modules/aurelia-portal-attribute/dist/amd",
      "main": "aurelia-portal-attribute"
    }
  ]
```

2. Make sure you use [manual bootstrapping](http://aurelia.io/docs#startup-and-configuration). In order to do so open your `index.html` and locate the element with the attribute aurelia-app. Change it to look like this:

```html
  <body aurelia-app="main">...</body>
```

3. In `main.js` in your `src`:

```js
  export function configure(aurelia) {
    aurelia.use
     .standardConfiguration()
     .plugin(PLATFORM.moduleName('aurelia-portal-attribute'))

    aurelia.start().then(a => a.setRoot());
  }
```

## [Using The Plugin]

There are a few scenarios you can take advantage of the attribute.

1. There is part of the element that needs to be rendered into document body.
This is a common case, as the component may be nested under a `overflow: hidden` ancestor and it won't be able to display properly. Consider the following dom structure of a custom `<combobox />` element: 

```html
  <template class="combobox">
    <div class="input-ct">
      <input ref="input" value.bind="filterText" />
    <div>
    <ul class="list-group items-list">
      <li repeat.for="item of items | filter: filterText" class="list-group-item">${item.name}</li>
    </ul>
  </template>
```

This structure often works fine when we have `ul.list-group.item-list` CSS: `position: absolute; top: 100%;` But it will not work when the custom element is nested inside an element with `overflow: hidden`, or inside an element with scroll, like following example:

```html
  <!-- app.html -->
  <div style="height: 200px; overflow: auto;">
    <!-- oopps, my list got clipped -->
    <combobox></combobox>
  </div>
```

A simple solution is to use CSS: `position: fixed` on the list and calculat its position, or the `portal` attribute like the following example:

```html
  <template class="combobox">
    <div class="input-ct">
      <input ref="input" value.bind="filterText" />
    <div>
    <ul portal class="list-group items-list">
      <li repeat.for="item of items | filter: filterText" class="list-group-item">${item.name}</li>
    </ul>
  </template>
```

`portal` attribute may seem to be an overkill, but beside styling, it also helps you separate DOM path of different parts in your custom element,
whist still binds them to the same underlying view model, which should helps better DOM manangement, including event model in some cases.
Following is an example of final rendered DOM tree for `<combobox/>` above:

```html
  <body>
    <app>
      <combobox>
        <!-- combobox internal elements -->
      </combobox>
    </app>
    <!-- combobox item list in the body -->
    <ul class="list-group items-list">
      <li class="list-group-item">item 1</li>
      <li class="list-group-item">item 2</li>
      <li class="list-group-item">item 3</li>
      ...
      <!-- more items -->
    </ul>
  </body>
```

## APIs

| Name | Types | Default | Description |
| - | - | - | - |
| target | string/Element | undefined | Target of the portal, by default will be resolved to document body, if target cannot be found.<br> If a string is supplied, it will be used to determine the real target with a call `document.querySelector()` |
| position | `beforebegin` or `afterbegin` or `beforeend` or `afterend` | `beforeend` | Describing the position relative to the target of a portal to move the content to |

### Examples

Portalling an element to document body
```html
<div class="my-menu" portal>
or
<div class="my-menu" portal="body">
```

Portalling multiple elements to the end of document body
```html
<template portal>
  <p>paragraph 1</p>
  <p>paragraph 2</p>
</template>
```

## Building The Code

To build the code, follow these steps.

1. Ensure that [NodeJS](http://nodejs.org/) is installed. This provides the platform on which the build tooling runs.
2. From the project folder, execute the following command:

  ```shell
  npm install
  ```

3. To build the code, you can now run:

  ```shell
  npm run build
  ```

4. You will find the compiled code in the `dist` folder, available in three module formats: AMD, CommonJS and ES6.

## Running The Tests

```shell
npm test
```

## Acknowledgement
Thanks goes to Dwayne Charrington for his Aurelia-TypeScript starter package https://github.com/Vheissu/aurelia-typescript-plugin
