import Page from "@classes/Page";

export default class Work extends Page {
  constructor() {
    super({
      element: ".work",
      elements: {
        wrapper: ".work__wrapper",
        mainWrapper: ".work__main__wrapper",
        h1: ".work__title",
      },
    });
  }

  create() {
    super.create();
  }

  show() {
    super.show();
  }
}
