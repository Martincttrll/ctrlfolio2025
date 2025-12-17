import Animation from "@classes/Animation";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

gsap.registerPlugin(TextPlugin);

export default class TypeWriter extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    this.text = this.element.innerText;
    this.element.innerText = "";
  }

  animateIn() {
    const delay = this.element.closest(".home__hero__wrapper") ? 1.2 : 0;
    gsap.to(this.element, {
      text: this.text,
      duration: this.text.length * 0.05,
      delay: Math.random() * 2 + delay,
      ease: "none",
    });
  }
}
