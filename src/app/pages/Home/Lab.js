export default class Lab {
  constructor(elements) {
    this.elements = elements;
    this.create();
  }

  create() {
    this.elements.forEach((item) => {
      const img = item.querySelector(".experiment__img");

      item.addEventListener("mouseenter", () => {
        img.style.transform = `translate(-50%, -50%) scale(1)`;
      });

      item.addEventListener("mouseleave", () => {
        img.style.transform = `translate(-50%, -50%) scale(0)`;
      });

      item.addEventListener("mousemove", (e) => {
        img.style.left = `${e.clientX}px`;
        img.style.top = `${e.clientY}px`;
      });
    });
  }

  addEventListeners() {}
}
