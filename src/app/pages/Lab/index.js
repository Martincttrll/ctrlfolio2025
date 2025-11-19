import Page from "@classes/Page";

export default class Lab extends Page {
  constructor() {
    super({
      element: ".lab",
      elements: {
        wrapper: ".lab__wrapper",
        mainWrapper: ".lab__main__wrapper",
        h1: ".lab__title",
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
