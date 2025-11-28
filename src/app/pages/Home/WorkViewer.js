import Component from "@classes/Component";
export class WorkViewer extends Component {
  constructor() {
    super({
      element: ".home__works__wrapper",
      elements: {
        title: ".work__title",
        img: ".work__img",
        tags: ".work__tags",
        link: ".work__link",
        navigation: ".work__navigation",
        prev: ".prev",
        next: ".next",
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
        link: work.data.link.url,
        imgUrl: work.data.img.url,
        tags: work.data.tags.map((tagObj) => tagObj.tag),
      });
    });
    console.log(this.works);
  }

  updateCompletion() {
    const percent = ((this.currentIndex + 1) / this.works.length) * 100;
    this.elements.completion.style.width = `${percent}%`;
  }

  displayWork(work) {
    this.elements.title.textContent = work.title;
    this.elements.img.src = work.imgUrl;
    this.elements.link.href = work.link;
    work.tags.forEach((tag) => {
      const tagSpan = document.createElement("span");
      tagSpan.classList.add("tag");
      tagSpan.textContent = tag;
      this.elements.tags.appendChild(tagSpan);
    });
    this.updateCompletion();
  }

  addEventListeners() {
    this.elements.next.addEventListener("click", () => {
      this.currentIndex = (this.currentIndex + 1) % this.works.length;
      this.displayWork(this.works[this.currentIndex]);
    });

    this.elements.prev.addEventListener("click", () => {
      this.currentIndex =
        (this.currentIndex - 1 + this.works.length) % this.works.length;
      this.displayWork(this.works[this.currentIndex]);
    });
  }
}
