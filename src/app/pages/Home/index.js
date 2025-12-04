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
    this.createWorkViewer();
    this.createLab();
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
