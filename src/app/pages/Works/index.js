import Page from "@classes/Page";

export default class Works extends Page {
  constructor() {
    super({
      element: ".works",
      elements: {
        wrapper: ".works__wrapper",
        mainWrapper: ".works__main__wrapper",
        h1: ".works__title",
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
