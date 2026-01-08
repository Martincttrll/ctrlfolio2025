import Component from "@classes/Component";
import TransitionWork from "@animations/TransitionWork.js";
import { gsap } from "gsap";
export default class WorkViewer extends Component {
  constructor() {
    super({
      element: ".home__works__wrapper",
      elements: {
        img: ".work__img",
        tags: ".work__tags",
        date: ".work__date",
        imgWrapper: ".work__img__wrapper",
        linkLabel: ".work__link__label",
        url: ".work__url",
        minimap: ".works__minimap__track",
        indicator: ".works__minimap__indicator",
      },
    });
    this.works = [];
    this.currentIndex = 0;
    this.parseWorks();
    this.createMinimap();
    this.createTransitionWork();
    this.displayWork(this.works[0], "firstcall");
    this.addEventListeners();
  }

  parseWorks() {
    const rawWorks = window.PRISMIC.works;
    rawWorks.forEach((work) => {
      this.works.push({
        title: work.data.title[0].text,
        link:
          "/works/" +
          work.data.title[0].text.toLowerCase().replace(/\s+/g, "-") +
          "/",
        date: work.data.year || "some year",
        url: work.data.link.url,
        imgUrl: work.data.img.url,
        tags: work.data.tags.map((tagObj) => tagObj.tag),
      });
    });
    const isYear = (d) => /^\d{4}$/.test(d);
    this.works = [...this.works].sort(
      (a, b) =>
        isYear(b.date) - isYear(a.date) || Number(b.date) - Number(a.date)
    );

    this.works = [...this.works, ...this.works, ...this.works];
  }

  createMinimap() {
    this.works.forEach((work) => {
      const thumbnail = document.createElement("div");
      thumbnail.classList.add("works__minimap__thumbnail");
      thumbnail.style.backgroundImage = `url("${work.imgUrl}")`;
      thumbnail.style.backgroundSize = "cover";
      thumbnail.style.backgroundPosition = "center";
      thumbnail.style.backgroundRepeat = "no-repeat";
      this.elements.minimap.appendChild(thumbnail);
    });
  }

  updateMinimap(isNext) {
    const thumbnails = this.elements.minimap.querySelectorAll(
      ".works__minimap__thumbnail"
    );
    const indicator = this.elements.indicator;
    const thumbHeight = thumbnails[0].offsetHeight;
    const gap = parseFloat(getComputedStyle(this.elements.minimap).gap);
    const total = thumbnails.length;

    const currentThumbnail = thumbnails[this.currentIndex];
    const newTop =
      currentThumbnail.getBoundingClientRect().top -
      this.elements.minimap.getBoundingClientRect().top;

    if (isNext !== "firstcall") {
      const isWrapNext = this.currentIndex - 1 < 0 && isNext;
      const isWrapPrev = this.currentIndex + 1 >= total && !isNext;

      const tl = gsap.timeline({ defaults: { ease: "power3.inOut" } });
      // --- CAS NEXT (ou wrap premier -> dernier) ---
      if ((isNext && !isWrapNext) || isWrapPrev) {
        const stretchHeight = isWrapPrev
          ? thumbHeight * total
          : thumbHeight * 2;

        tl.to(indicator, {
          height: stretchHeight,
          duration: 0.25,
        }).to(indicator, {
          top: newTop,
          height: thumbHeight,
          duration: 0.25,
        });
      }

      // --- CAS PREV (ou wrap dernier -> premier) ---
      else if ((!isNext && !isWrapPrev) || isWrapNext) {
        const stretchHeight = isWrapNext
          ? thumbHeight * total
          : thumbHeight * 2;

        tl.to(indicator, {
          top: newTop,
          height: stretchHeight,
          duration: 0.25,
        }).to(indicator, {
          height: thumbHeight,
          duration: 0.25,
        });
      }
    }

    thumbnails.forEach((thumbnail) => {
      if (thumbnail !== currentThumbnail) {
        thumbnail.style.filter = "grayscale(100%)";
      }
    });

    currentThumbnail.style.filter = "grayscale(0%)";
  }

  displayWork(work, isNext) {
    this.elements.img.src = work.imgUrl;
    this.elements.date.textContent = "//" + work.date;
    this.elements.url.href = work.url;
    this.elements.tags.innerHTML = "";
    work.tags.forEach((tag) => {
      const tagSpan = document.createElement("div");
      tagSpan.classList.add("tag");
      tagSpan.textContent = "[" + tag + "]";
      this.elements.tags.appendChild(tagSpan);
    });

    this.updateMinimap(isNext);
  }

  createTransitionWork() {
    this.transitionWork = new TransitionWork({
      element: this.elements.imgWrapper,
      elements: { img: this.elements.img },
    });
  }

  addEventListeners() {
    const imgWrapper = this.elements.imgWrapper;
    const label = this.elements.linkLabel;

    // initial styles
    label.style.position = "absolute";
    label.style.pointerEvents = "none";
    label.style.opacity = 0;
    label.style.transform = "translate3d(0,0,0)";

    // helper to enable marquee markup (duplicate text for seamless scroll)
    const setMarquee = (text) => {
      label.innerHTML = `<div class="ribbon"><div class="ribbon__track"><span class="ribbon__text">${text}</span><span class="ribbon__text">${text}</span></div></div>`;
      // tune animation duration and distance based on text width and gap
      const track = label.querySelector(".ribbon__track");
      const textEl = label.querySelector(".ribbon__text");
      if (!track || !textEl) return;
      // ensure layout measured
      const singleWidth = textEl.offsetWidth;
      const computed = window.getComputedStyle(track);
      const gapValue =
        computed.gap ||
        computed.getPropertyValue("column-gap") ||
        computed.getPropertyValue("grid-column-gap") ||
        "48px";
      const gap = parseFloat(gapValue) || 48;

      const distance = singleWidth + gap;
      track.style.setProperty("--marquee-distance", `${distance}px`);

      const speed = 60;
      const duration = Math.max(3, Math.round(distance / speed));
      track.style.setProperty("--marquee-duration", `${duration}s`);

      track.style.animation = "none";
      const ribbon = label.querySelector(".ribbon");
      ribbon.style.width = `${singleWidth}px`;
      ribbon.style.overflow = "hidden";
      track.style.animation = null;
    };

    imgWrapper.addEventListener("mouseenter", () => {
      label.style.opacity = 1;
    });
    imgWrapper.addEventListener("mouseleave", () => {
      label.style.opacity = 0;
    });

    this._desiredPos = { x: 0, y: 0 };
    this._currentPos = { x: 0, y: 0 };
    this._followEase = 0.18;

    const rafLoop = () => {
      this._currentPos.x +=
        (this._desiredPos.x - this._currentPos.x) * this._followEase;
      this._currentPos.y +=
        (this._desiredPos.y - this._currentPos.y) * this._followEase;
      label.style.transform = `translate3d(${Math.round(
        this._currentPos.x
      )}px, ${Math.round(this._currentPos.y)}px, 0)`;
      this._rafId = requestAnimationFrame(rafLoop);
    };
    if (!this._rafId) this._rafId = requestAnimationFrame(rafLoop);

    imgWrapper.addEventListener("mousemove", (e) => {
      const rect = imgWrapper.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const leftZone = rect.width * 0.2;
      const rightZone = rect.width * 0.8;

      if (mouseX < leftZone) {
        const text = "‹ Previous";
        if (
          !label.classList.contains("ribbon--marquee") ||
          label.dataset.text !== text
        ) {
          setMarquee(text);
          label.classList.add("ribbon--marquee");
          label.dataset.text = text;
        }
        let x = mouseX - label.offsetWidth / 2;
        let y = mouseY + 12;
        x = Math.max(0, Math.min(x, rect.width - label.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - label.offsetHeight));
        this._desiredPos.x = x;
        this._desiredPos.y = y;
        this.hoverZone = "prev";
        return;
      }

      if (mouseX > rightZone) {
        const text = "Next ›";
        if (
          !label.classList.contains("ribbon--marquee") ||
          label.dataset.text !== text
        ) {
          setMarquee(text);
          label.classList.add("ribbon--marquee");
          label.dataset.text = text;
        }
        let x = mouseX - label.offsetWidth / 2;
        let y = mouseY + 12;
        x = Math.max(0, Math.min(x, rect.width - label.offsetWidth));
        y = Math.max(0, Math.min(y, rect.height - label.offsetHeight));
        this._desiredPos.x = x;
        this._desiredPos.y = y;
        this.hoverZone = "next";
        return;
      }

      this.hoverZone = "middle";
      const currentTitle = this.works[this.currentIndex].title;
      const title =
        currentTitle === "???"
          ? currentTitle + " - " + currentTitle
          : currentTitle + " - discover";
      if (
        !label.classList.contains("ribbon--marquee") ||
        label.dataset.text !== title
      ) {
        setMarquee(title);
        label.classList.add("ribbon--marquee");
        label.dataset.text = title;
      }

      // compute position so ribbon stays inside imgWrapper
      const paddingY = 12;
      let x = mouseX - label.offsetWidth / 2;
      // place marquee below cursor instead of above
      let y = mouseY + paddingY;
      x = Math.max(0, Math.min(x, rect.width - label.offsetWidth));
      y = Math.max(0, Math.min(y, rect.height - label.offsetHeight));
      this._desiredPos.x = x;
      this._desiredPos.y = y;
    });

    // handle clicks: previous/next or follow imgWrapper
    imgWrapper.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (this.hoverZone === "prev") {
        this.currentIndex =
          (this.currentIndex - 1 + this.works.length) % this.works.length;
        this.displayWork(this.works[this.currentIndex], false);
      } else if (this.hoverZone === "next") {
        this.currentIndex = (this.currentIndex + 1) % this.works.length;
        this.displayWork(this.works[this.currentIndex], true);
      } else {
        this.transitionWork.animateIn(this.works[this.currentIndex]);
        // window.app.onChange({ url: this.works[this.currentIndex].link });
      }
    });

    const thumbnails = document.querySelectorAll(".works__minimap__thumbnail");

    if (thumbnails.length > 0) {
      thumbnails.forEach((thumbnail, index) => {
        thumbnail.addEventListener("click", (e) => {
          e.stopImmediatePropagation();
          const isNext = index > this.currentIndex;
          this.currentIndex = index;
          this.displayWork(this.works[this.currentIndex], isNext);
        });
      });
    }
  }
}
