import * as THREE from "three";
import LiquidBackground from "./LiquidBackground";

export default class Home {
  constructor({ scene, sizes, renderer }) {
    this.scene = scene;
    this.renderer = renderer;
    this.sizes = sizes;
    this.group = new THREE.Group();
  }

  create() {}

  createLiquidBackground() {
    this.liquidBackground = new LiquidBackground({
      wrapper: document.querySelector(".home__wrapper"),
      group: this.group,
      renderer: this.renderer,
      sizes: this.sizes,
    });
  }

  update(scroll) {
    if (this.liquidBackground) {
      this.liquidBackground.update(scroll);
    }
  }

  onResize(sizes) {
    this.sizes = sizes;
    if (this.liquidBackground) {
      this.liquidBackground.onResize(this.sizes);
    }
  }

  addDebug() {}

  async show() {
    if (!this.liquidBackground) {
      this.createLiquidBackground();
    }
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
