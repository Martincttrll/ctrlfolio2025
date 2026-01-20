import "@styles/style.scss";
import Home from "@pages/Home";
import Works from "@pages/Works";
import Work from "@pages/Work";
import Lab from "@pages/Lab";
import Contact from "@pages/Contact";
import { Navigation } from "@components/Navigation";
import { each } from "lodash";
import { Preloader } from "@components/Preloader";
import Canvas from "@components/Canvas";
import gsap from "gsap";
import { Cursor } from "@components/Cursor";
import Footer from "@components/Footer";
class App {
  constructor() {
    console.log("©2026 - MartinCtrl");
    this.createContent();
    this.createPreloader();
    this.createNavigation();
    // this.createCursor();
    // this.createFooter();
    this.createPages();
    this.createCanvas();
    this.addEventListeners();
    this.addLinkListeners();
    this.addDebug();
    gsap.ticker.add(this.update.bind(this));
  }

  createContent() {
    this.content = document.querySelector(".content");
    this.template = this.content.getAttribute("data-template");
  }

  createNavigation() {
    this.navigation = new Navigation(this.template);
  }

  createCursor() {
    this.cursor = new Cursor();
  }

  createFooter() {
    this.footer = new Footer();
  }

  createPreloader() {
    this.preloader = new Preloader();

    this.preloader.once("completed", this.onPreloaded.bind(this));
    this.preloader.once(
      "animationCompleted",
      this.onPreloaderAnimationCompleted.bind(this),
    );
  }

  createPages() {
    this.pages = {
      home: new Home(),
      works: new Works(),
      work: new Work(),
      lab: new Lab(),
      contact: new Contact(),
    };

    this.page = this.pages[this.template];
    this.page.create();
  }

  createCanvas() {
    this.canvas = new Canvas({ template: this.template });
  }

  update() {
    if (this.canvas) {
      this.canvas.update(this.page.smoothScroll.scroll);
    }
  }

  /*
   * Events
   */

  onPreloaded() {
    //Canvas
    this.onResize(); //Set les sizes
    this.canvas.onPreloaded();
    this.update();
    this.page.setCanvasPage(this.canvas.canvasPage);
    requestAnimationFrame(() => {
      this.onResize(); //Vraiment resizes tous les elements cavans
    });
  }

  onPreloaderAnimationCompleted() {
    this.page.show();
  }

  onResize() {
    if (this.page && this.page.onResize) {
      this.page.onResize();
    }

    if (this.canvas && this.canvas.onResize) {
      this.canvas.onResize();
    }
  }

  onPopState = () => {
    this.onChange({
      url: window.location.pathname,
      push: true,
    });
  };

  async onChange({ url, push = true }) {
    console.log("test");
    if (
      this.isFetching ||
      this.url === url ||
      url === null ||
      url === undefined ||
      url === "undefined"
    )
      return;
    console.log("test2");

    this.isFetching = true;
    // start hide animation but don't await it so fetch can run concurrently
    const hidePromise = this.page.hide();

    const request = await window.fetch(url);
    if (request.status === 200) {
      const html = await request.text();
      const tempDom = document.createElement("div");
      tempDom.innerHTML = html;
      const newContent = tempDom.querySelector(".content");
      const newTemplate = newContent.getAttribute("data-template");
      const newTitle = tempDom.querySelector("title").innerText;

      if (!newContent || !this.pages[newTemplate]) {
        throw new Error("New page content or template not found");
      }

      this.content.replaceWith(newContent);
      this.content = newContent;
      this.template = newTemplate;
      document.title = newTitle;

      if (this.navigation.onChange) {
        this.navigation.onChange(this.template);
      }

      if (push) {
        window.history.pushState({}, "", url);
      }

      this.page = this.pages[this.template];
      this.page.create();

      this.onResize();

      // // ensure the previous page hide animation finished before running show()
      // try {
      //   await hidePromise;
      // } catch (e) {
      //   // swallow errors from hide so navigation still proceeds
      // }
      await this.page.show();

      this.canvas.onChange({ template: this.template, url });
      this.page.setCanvasPage(this.canvas.canvasPage);

      const requestedUrl = new URL(url, window.location.origin);
      const requestedHash = requestedUrl.hash;
      if (requestedHash) {
        requestAnimationFrame(() => {
          const id = requestedHash.slice(1);
          const targetEl =
            document.getElementById(id) ||
            document.querySelector(requestedHash);
          if (targetEl) {
            if (
              this.page &&
              this.page.smoothScroll &&
              this.page.smoothScroll.lenis
            ) {
              this.page.smoothScroll.lenis.scrollTo(targetEl, {
                offset: 0,
                duration: 1,
              });
            } else {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
          }
        });
      }

      this.isFetching = false;
      this.addLinkListeners();
    } else {
      console.log("Error fetching page");
    }
  }

  onContextMenu(event) {
    event.preventDefault();
    event.stopPropagation();
    return false;
  }
  addLinkListeners() {
    const links = document.querySelectorAll("a");

    each(links, (link) => {
      link.addEventListener("click", (e) => {
        const hrefAttr = link.getAttribute("href") || "";
        if (!link.href.startsWith(window.location.origin)) return;

        if (hrefAttr.startsWith("#") || hrefAttr.startsWith("/#")) {
          const targetUrl = new URL(link.href);
          const targetPath = targetUrl.pathname;
          const targetHash = targetUrl.hash;

          if (targetPath === window.location.pathname) {
            e.preventDefault();
            if (!targetHash) return;
            const id = targetHash.slice(1);
            const targetEl =
              document.getElementById(id) || document.querySelector(targetHash);
            if (
              this.page &&
              this.page.smoothScroll &&
              this.page.smoothScroll.lenis &&
              targetEl
            ) {
              this.page.smoothScroll.lenis.scrollTo(targetEl, {
                offset: 0,
                duration: 1,
              });
            } else if (targetEl) {
              targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
            }
            try {
              window.history.pushState({}, "", targetPath + targetHash);
            } catch (err) {
              window.location.hash = targetHash;
            }
            return;
          }

          e.preventDefault();
          this.onChange({ url: link.href });
          return;
        }
        e.preventDefault();
        const { href } = link;
        this.onChange({ url: href });
      });
    });
  }

  addEventListeners() {
    window.addEventListener("popstate", this.onPopState, { passive: true });
    window.addEventListener("resize", this.onResize.bind(this));
    // window.oncontextmenu = this.onContextMenu; //Disable right click
  }

  addDebug() {
    if (window.location.protocol !== "https:") {
      each(this.pages, (page) => {
        if (page && typeof page.addDebug === "function") {
          page.addDebug();
        }
      });
      if (this.canvasPage && typeof this.canvasPage.addDebug === "function") {
        this.canvasPage.addDebug();
      }
    }
  }
}

window.app = new App();
