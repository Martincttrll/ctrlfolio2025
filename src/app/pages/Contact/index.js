import Page from "@classes/Page";

export default class Contact extends Page {
  constructor() {
    super({
      element: ".contact",
      elements: {
        wrapper: ".contact__wrapper",
        mainWrapper: ".contact__main__wrapper",
        h1: ".contact__title",
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
