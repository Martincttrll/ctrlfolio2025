import Animation from "@classes/Animation";
import gsap from "gsap";
import SplitText from "gsap/SplitText";

gsap.registerPlugin(SplitText);

export default class MainTitle extends Animation {
  constructor({ element, elements }) {
    super({ element, elements });
    console.log(elements);
  }

  animateIn() {
    const tl = gsap.timeline({
      onComplete: () => {
        this.observer.disconnect();
      },
    });

    this.elements.span.forEach((line) => {
      const splits = SplitText.create(line, {
        type: "chars",
        mask: "chars",
      });

      gsap.set(splits.chars, {
        y: "100%",
      });

      tl.to(
        splits.chars,
        {
          y: "0%",
          stagger: 0.05,
          ease: "power2.inOut",
        },
        0
      );
    });

    const splits = SplitText.create(this.elements.baseline, {
      type: "lines",
      mask: "lines",
    });

    gsap.set(splits.lines, {
      y: "-100%",
    });

    tl.to(splits.lines, {
      y: "0%",
    });
  }
}
