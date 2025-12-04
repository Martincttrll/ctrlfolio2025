import Page from "@classes/Page";
import Lab from "./Lab";
import WorkViewer from "./WorkViewer";

export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        mainWrapper: ".home__main__wrapper",
        h1: ".home__title",
        experiments: ".home__experiment",
      },
    });
  }

  create() {
    super.create();
    this.initHeroInfo();
    this.createWorkViewer();
    this.createLab();
  }

  initHeroInfo() {
    const pad = (n) => n.toString().padStart(2, "0");

    const dateEl = document.querySelector('[data-info="date"]');
    const timestampEl = document.querySelector('[data-info="timestamp"]');

    const updateClock = () => {
      const now = new Date();

      const YYYY = new Date().getFullYear();
      const MM = pad(now.getMonth() + 1);
      const DD = pad(now.getDate());
      const hh = pad(now.getHours());
      const mm = pad(now.getMinutes());
      const ss = pad(now.getSeconds());

      const timestamp = Math.floor(now.getTime() / 1000);

      dateEl.textContent = `${YYYY}-${MM}-${DD} ${hh}:${mm}:${ss}`;
      timestampEl.textContent = `[${timestamp}]`;
    };

    updateClock();
    setInterval(updateClock, 1000);
  }

  createWorkViewer() {
    this.workViewer = new WorkViewer();
  }

  createLab() {
    this.lab = new Lab(this.elements.experiments);
  }

  show() {
    super.show();
  }
}
