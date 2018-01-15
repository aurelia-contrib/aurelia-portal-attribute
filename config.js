System.config({
  defaultJSExtensions: true,
  transpiler: false,
  paths: {
    "github:*": "jspm_packages/github/*",
    "npm:*": "jspm_packages/npm/*"
  },

  map: {
    "aurelia-pal": "npm:aurelia-pal@1.4.0",
    "aurelia-binding": "npm:aurelia-binding@1.2.2",
    "aurelia-pal-browser": "npm:aurelia-pal-browser@1.3.0",
    "aurelia-polyfills": "npm:aurelia-polyfills@1.0.0",
    "aurelia-templating": "npm:aurelia-templating@1.4.2",
    "npm:aurelia-pal-browser@1.3.0": {
      "aurelia-pal": "npm:aurelia-pal@1.4.0"
    },
    "npm:aurelia-polyfills@1.0.0": {
      "aurelia-pal": "npm:aurelia-pal@1.4.0"
    },
  }
});
