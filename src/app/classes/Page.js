import EventEmitter from "events";
import { each } from "lodash";
import { SmoothScroll } from "@animations/SmoothScroll";
import TypeWriter from "@animations/TypeWriter";
import MainTitle from "@animations/MainTitle";
import { gsap } from "gsap";
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
    console.log("show");
    return new Promise((resolve) => {
      // simple DOM-based lookup: find existing swarm container and destroy it
      const container = document.querySelector(".ctrl-swarm-container");

      if (!container) {
        this.isVisible = true;
        this.addEventListeners();
        resolve();
        return;
      }

      const items = Array.from(container.querySelectorAll(".ctrl-swarm-item"));

      const tl = gsap.timeline({
        onComplete: () => {
          container.parentNode && container.parentNode.removeChild(container);
          this._ctrlSwarm = null;
          this.isVisible = true;
          this.addEventListeners();
          resolve();
        },
      });

      tl.to(items, {
        duration: 0.45,
        visibility: "hidden",
        ease: "power3.in",
        stagger: { each: 0.03 },
      });
    });
  }

  hide(_url) {
    console.log("hide");
    this.isVisible = false;
    this.removeEventListeners();
    return new Promise((resolve) => {
      const container = document.createElement("div");
      container.className = "ctrl-swarm-container";
      container.style.position = "fixed";
      container.style.top = "0";
      container.style.left = "0";
      container.style.width = "100vw";
      container.style.height = "100vh";
      container.style.overflow = "hidden";
      container.style.pointerEvents = "none";
      container.style.zIndex = "9999";
      document.body.appendChild(container);

      const items = [];
      for (let i = 0; i < 50; i++) {
        const el = document.createElement("div");
        el.className = "ctrl-swarm-item";
        el.textContent = "CTRL";
        el.style.position = "absolute";
        const x = Math.random() * 100;
        const y = Math.random() * 100;
        el.style.left = x + "vw";
        el.style.top = y + "vh";
        el.style.transform = "translate(-50%, -50%)";
        el.style.whiteSpace = "nowrap";
        el.style.fontFamily = "IBMVGA";
        el.style.fontSize = "60rem";
        el.style.visibility = "hidden";
        el.style.pointerEvents = "none";
        container.appendChild(el);
        items.push(el);
      }

      // ensure any existing container is removed first (avoid duplicates)
      const existing = document.querySelector(".ctrl-swarm-container");
      if (existing) {
        existing.parentNode && existing.parentNode.removeChild(existing);
      }

      this._ctrlSwarm = { container, items };

      const tl = gsap.timeline({
        onComplete: () => {
          resolve();
        },
      });

      tl.to(items, {
        duration: 0.8,
        visibility: "visible",
        ease: "back.out(1.2)",
        stagger: { each: 0.1, grid: "auto" },
      });
    });
  }

  addEventListeners() {}
  removeEventListeners() {}
}
