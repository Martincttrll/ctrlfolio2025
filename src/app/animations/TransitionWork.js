import Component from "@classes/Component";
import gsap from "gsap";

export default class TransitionWork extends Component {
  constructor({ element, elements }) {
    super({ element, elements });

    this.work = null;
  }

  createMockImg() {
    this.img = document
      .querySelector(`img[src="${this.work.imgUrl}"]`)
      .parentNode.cloneNode(true);
    this.img.removeChild(this.img.querySelector(".work__link__label"));

    this.img.style.position = "fixed";
    this.img.style.top = `${this.elements.img.getBoundingClientRect().top}px`;
    this.img.style.left = `${this.elements.img.getBoundingClientRect().left}px`;
    this.img.style.width = `${
      this.elements.img.getBoundingClientRect().width
    }px`;
    this.img.style.height = `${
      this.elements.img.getBoundingClientRect().height
    }px`;
    this.img.style.objectFit = "cover";
    this.img.style.zIndex = "3";
    document.querySelector("body").appendChild(this.img);
  }

  createHidingDiv() {
    const hidingDiv = document.createElement("div");
    this.hidingDiv = hidingDiv;
    hidingDiv.classList.add("hiding-div");
    hidingDiv.style.position = "fixed";
    hidingDiv.style.top = "0";
    hidingDiv.style.left = "0";
    hidingDiv.style.width = "100vw";
    hidingDiv.style.height = "100vh";
    hidingDiv.style.backgroundColor = "#191919";
    hidingDiv.style.zIndex = "2";
    hidingDiv.style.pointerEvents = "none";
    hidingDiv.style.transformOrigin = "right bottom";
    hidingDiv.style.transform = "scale(0)";
    document.querySelector("body").appendChild(hidingDiv);
  }

  animateIn(work) {
    this.work = work;
    this.createMockImg();
    this.createHidingDiv();

    const tl = gsap.timeline({});
    tl.to(this.hidingDiv.style, {
      duration: 0.8,
      ease: "power3.inOut",
      transform: "scale(1)",
    });

    tl.call(() => {
      window.app.onChange({ url: work.link });
    });

    tl.to(this.img, {
      top: "0px",
      left: "0px",
      duration: 0.8,
      ease: "power3.inOut",
    });
    tl.to(this.img, {
      width: "100vw",
      height: "70dvh",
      duration: 0.8,
      ease: "power3.inOut",
    });

    tl.to(this.hidingDiv, {
      duration: 0.4,
      ease: "power3.inOut",
      width: "0px",
      onComplete: () => {
        this.hidingDiv.parentNode.removeChild(this.hidingDiv);
        this.img.parentNode.removeChild(this.img);
      },
    });
  }
}
