---
{
  "name": "Aurelia Blur Plugin",
  "culture": "en-US",
  "description": "The guide of the blur plugin for Aurelia.",
  "engines" : { "aurelia-doc" : "^1.0.0" },
  "author": {
    "name": "Binh Vo",
    "url": "http://bigopon.surge.sh"
  },
  "contributors": [],
  "translators": [],
  "keywords": ["Blur", "Focus", "JavaScript"]
}
---

## [Introduction](aurelia-doc://section/1/version/1.0.0)

This article covers the blur plugin for Aurelia. This plugin is created for managing focus in your application. The plugin supports the use of dynamic elements matching, via either element references or CSS selectors.


## [Installing The Plugin](aurelia-doc://section/2/version/1.0.0)

1. In your **JSPM**-based project install the plugin via `jspm` with following command

```shell
jspm install aurelia-blur-plugin
```

If you use **Webpack**, install the plugin with the following command

```shell
npm install aurelia-blur-plugin --save
```

If you use the **Aurelia CLI**, install the plugin with the following command

```shell
npm install aurelia-blur-plugin --save
```

2. Make sure you use [manual bootstrapping](http://aurelia.io/docs#startup-and-configuration). In order to do so open your `index.html` and locate the element with the attribute aurelia-app. Change it to look like this:

<code-listing heading="index.html">
  <source-code lang="HTML">
  <body aurelia-app="main">...</body>
  </source-code>
</code-listing>

3. Create (if you haven't already) a file `main.js` in your `src` folder with following content:

<code-listing heading="main.js">
  <source-code lang="ES 2015">
  export function configure(aurelia) {

    /**
     * We will cover reasons behind these options in later sections
     */
    let listeningModeOptions = {
      pointer: false, // listen for pointer event interaction
      touch: false, // listen for touch event interaction
      mouse: false, // listen for mouse event interaction
      focus: false, // listen for foucs event
      windowBlur: false // listen for window blur event (navigating away from window)
    }

    aurelia.use
      .standardConfiguration()
      .developmentLogging()
      .plugin('aurelia-blur-plugin', listeningModeOptions);

    aurelia.start().then(a => a.setRoot());
  }
  </source-code>
</code-listing>

## [Using The Plugin](aurelia-doc://section/3/version/1.0.0)

There are a few scenarios you can take advantage of the Aurelia blur plugin.

1. You can use the dialog service to control when a form should be hidden.
This is a common case, consider the following dom structure

![](http://i.imgur.com/oBF5Ryv.png)

It's clear that our intent is only trigger the blur, when we interact with any elements outside the form element. One may implement it like following:

<code-listing heading="naive-blur.js">
  <source-code lang="html">
    <div>
      <button click.delegate="formIsBlur = false">Show Form</button>
      <form if.bind="formIsBlur">
        <input blur.trigger="formIsBlur = true" />
        <select blur.trigger="formIsBlur = true"></select>
        <input blur.trigger="formIsBlur = true" />
      </form>

      <!-- Or more optimized version -->
      <form blur.capture="formIsBlur = true">
        <input />
        <select></select>
        <input />
      </form>
    </div>
  </source-code>
</code-listing>

This is often insufficient, as what we do want is to react when either (pointer/ touch/ mouse) down, or focus on elements outside of the form, but what we will get is any focus navigation between inputs. The plugin solves this for you, by listening to some critical events to determine if focus is still inside an element.
