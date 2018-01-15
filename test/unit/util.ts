import { DOM } from 'aurelia-pal';

export function markupToElement(markup: string) {
  return (DOM.createTemplateFromMarkup(`<template>${markup}</template>`) as HTMLTemplateElement).content.firstChild as HTMLElement;
}