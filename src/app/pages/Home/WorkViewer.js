import Component from "@classes/Component";
export default class WorkViewer extends Component {
  constructor() {
    super({
      element: ".home__works__wrapper",
      elements: {
        title: ".work__title",
        img: ".work__img",
        tags: ".work__tags",
        date: ".work__date",
        link: ".work__link",
        linkLabel: ".work__link__label",
        url: ".work__url",
        completion: ".works__completion__inner",
      },
    });
    this.works = [];
    this.currentIndex = 0;
    this.parseWorks();
    this.displayWork(this.works[0]);
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
        date: work.data.year,
        url: work.data.link.url,
        imgUrl: work.data.img.url,
        tags: work.data.tags.map((tagObj) => tagObj.tag),
      });
    });
  }

  updateCompletion() {
    const percent = ((this.currentIndex + 1) / this.works.length) * 100;
    this.elements.completion.style.width = `${percent}%`;
  }

  displayWork(work) {
    this.elements.title.textContent = work.title;
    this.elements.img.src = work.imgUrl;
    this.elements.date.textContent = "//date:" + work.date;
    this.elements.url.href = work.url;
    this.elements.tags.innerHTML = "";
    work.tags.forEach((tag) => {
      const tagSpan = document.createElement("div");
      tagSpan.classList.add("tag");
      tagSpan.textContent = "[" + tag + "]";
      this.elements.tags.appendChild(tagSpan);
    });
    this.updateCompletion();
  }

  addEventListeners() {
    this.elements.link.addEventListener("mousemove", (e) => {
      const rect = this.elements.link.getBoundingClientRect();
      const label = this.elements.linkLabel;

      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      const leftZone = rect.width * 0.2;
      const rightZone = rect.width * 0.8;

      label.style.opacity = 1;
      this.elements.img.style.filter = "brightness(0.8)";

      if (mouseX < leftZone) {
        label.textContent = "← previous";
        label.style.transform = "none";

        label.style.left = `${mouseX - label.offsetWidth / 2}px`;
        label.style.top = `${mouseY - label.offsetHeight / 2}px`;

        this.hoverZone = "prev";
        return;
      }

      if (mouseX > rightZone) {
        label.textContent = "next →";
        label.style.transform = "none";

        label.style.left = `${mouseX - label.offsetWidth / 2}px`;
        label.style.top = `${mouseY - label.offsetHeight / 2}px`;

        this.hoverZone = "next";
        return;
      }

      this.hoverZone = "middle";
      label.textContent = "(Discover)";
      label.style.transform = "none";

      let x = mouseX - label.offsetWidth / 2;
      let y = mouseY - label.offsetHeight / 2;

      x = Math.max(0, Math.min(x, rect.width - label.offsetWidth));
      y = Math.max(0, Math.min(y, rect.height - label.offsetHeight));

      label.style.left = `${x}px`;
      label.style.top = `${y}px`;
    });

    this.elements.link.addEventListener("click", (e) => {
      e.stopImmediatePropagation();
      if (this.hoverZone === "prev") {
        this.currentIndex =
          (this.currentIndex - 1 + this.works.length) % this.works.length;
        this.displayWork(this.works[this.currentIndex]);
      } else if (this.hoverZone === "next") {
        this.currentIndex = (this.currentIndex + 1) % this.works.length;
        this.displayWork(this.works[this.currentIndex]);
      } else {
        window.app.onChange({ url: this.works[this.currentIndex].link });
      }
    });
  }
}
