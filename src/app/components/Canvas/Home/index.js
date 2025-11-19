import * as THREE from "three";
import LiquidBackground from "./LiquidBackground";

export default class Home {
  constructor({ scene, sizes, camera }) {
    this.scene = scene;
    this.sizes = sizes;
    this.camera = camera;
    this.group = new THREE.Group();
  }

  create() {}

  createLiquidBackground() {
    this.liquidBackground = new LiquidBackground({
      element: document.querySelector(".home__background__img"),
      group: this.group,
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
