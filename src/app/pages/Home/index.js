import Page from "@classes/Page";
import { WorkViewer } from "./WorkViewer";

export default class Home extends Page {
  constructor() {
    super({
      element: ".home",
      elements: {
        wrapper: ".home__wrapper",
        mainWrapper: ".home__main__wrapper",
        h1: ".home__title",
      },
    });
  }

  create() {
    super.create();
    this.createWorkViewer();
  }

  createWorkViewer() {
    this.workViewer = new WorkViewer();
  }

  show() {
    super.show();
  }
}
