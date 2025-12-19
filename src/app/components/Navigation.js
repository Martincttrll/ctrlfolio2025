import { each } from "lodash";
import gsap from "gsap";

export class Navigation {
  constructor() {
    this.navigation = document.querySelector(".nav__wrapper");
    this.links = document.querySelectorAll(".nav__tab");
    // this.addEventListeners();
  }

  addEventListeners() {
    // this.links.forEach((link) => {
    //   link.addEventListener("click", (e) => {
    //     e.preventDefault();
    //     const targetID = link.getAttribute("href");
    //     const target = document.querySelector(targetID);
    //     console.log(target);
    //     console.log(this.lenis);
    //     if (!target) return;
    //     // this.lenis is set in App.createPages()
    //     this.lenis.scrollTo(target, {
    //       offset: 0,
    //       duration: 1.2,
    //       easing: (t) => 1 - Math.pow(1 - t, 3),
    //     });
    //   });
    // });
  }

  show() {
    this.navigation.classList.add("active");
  }

  hide() {
    this.navigation.classList.remove("active");
  }
}
