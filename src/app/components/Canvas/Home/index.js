import * as THREE from "three";

export default class Home {
  constructor({ scene, sizes, renderer }) {
    this.scene = scene;
    this.renderer = renderer;
    this.sizes = sizes;
    this.group = new THREE.Group();
  }

  create() {}

  update(scroll) {}

  onResize(sizes) {
    this.sizes = sizes;
  }

  addDebug() {
    document.addEventListener("keydown", (event) => {
      if (event.key === "d") {
        console.log(this.scene);
      }
    });
  }

  async show() {
    this.scene.add(this.group);
  }
  hide() {
    this.scene.remove(this.group);
  }
}
