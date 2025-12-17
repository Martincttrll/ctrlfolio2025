import EventEmitter from "events";
import { each } from "lodash";
import { SmoothScroll } from "@animations/SmoothScroll";
import TypeWriter from "@animations/TypeWriter";
import MainTitle from "@animations/MainTitle";
export default class Page extends EventEmitter {
  constructor({ element, elements }) {
    super();

    this.selectors = {
      element,
      ...elements,
      // animationsTitles: "[data-animation='title']",
      animationsTypeWriter: ".text__col pre",
      animationsMainTitle: '[data-animation="main-title"]',
    };
  }

  create() {
    this.element = document.querySelector(this.selectors.element);
    this.elements = {};

    each(this.selectors, (selector, key) => {
      if (
        selector instanceof window.HTMLElement ||
        selector instanceof window.NodeList ||
        Array.isArray(selector)
      ) {
        this.elements[key] = selector;
      } else {
        this.elements[key] = this.element.querySelectorAll(selector);
        if (this.elements[key].length === 0) {
          this.elements[key] = null;
        } else if (this.elements[key].length === 1) {
          this.elements[key] = this.element.querySelector(selector);
        }
      }
    });
    this.createSmoothScroll();
    this.createAnimations();
  }

  createAnimations() {
    const toArray = (elements) => {
      if (!elements) return [];
      return elements instanceof NodeList || Array.isArray(elements)
        ? Array.from(elements)
        : [elements];
    };

    this.animationsTypeWriter = toArray(this.elements.animationsTypeWriter).map(
      (element) => new TypeWriter({ element })
    );
    this.animationsMainTitle = toArray(this.elements.animationsMainTitle).map(
      (element) =>
        new MainTitle({
          element,
          elements: {
            span: document.querySelectorAll("h1 span"),
            baseline: document.querySelector(".home__baseline"),
          },
        })
    );
  }

  createSmoothScroll() {
    this.smoothScroll = new SmoothScroll(this.element, this.elements.wrapper);
  }

  setCanvasPage(canvasPage) {
    this.canvasPage = canvasPage;
  }

  show(_url) {
    this.isVisible = true;
    this.addEventListeners();

    return Promise.resolve();
  }

  hide(_url) {
    this.isVisible = false;
    this.removeEventListeners();
    return Promise.resolve();
  }

  addEventListeners() {}
  removeEventListeners() {}
}
