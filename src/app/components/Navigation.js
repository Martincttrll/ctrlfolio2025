import { each } from "lodash";
import gsap from "gsap";

export class Navigation {
  constructor(template, displayed = true) {
    this.navigation = document.querySelector(".nav__wrapper");
  }

  show() {
    this.navigation.classList.add("active");
  }

  hide() {
    this.navigation.classList.remove("active");
  }
}
