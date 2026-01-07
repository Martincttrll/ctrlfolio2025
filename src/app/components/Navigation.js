import { each } from "lodash";
import gsap from "gsap";

export class Navigation {
  constructor() {
    this.navigation = document.querySelector(".nav__wrapper");
    this.links = document.querySelectorAll(".nav__tab");
    this.logo = document.querySelector(".nav__logo");
    this.addEventListeners();
  }

  addEventListeners() {
    this.logo.addEventListener("mouseover", (event) => {
      document.querySelector(".eye").style.display = "block";
    });
    this.logo.addEventListener("mouseleave", (event) => {
      document.querySelector(".eye").style.display = "none";
    });
  }

  show() {}

  hide() {}
}
