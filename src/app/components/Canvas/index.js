import * as THREE from "three";
import Home from "./Home";
import LiquidBackground from "./LiquidBackground";
export default class Canvas {
  constructor({ template }) {
    this.template = template;
    this.createRenderer();
    this.createScene();
    this.createCamera();
    this.createLiquidBackground();
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });

    this.renderer.domElement.style.pointerEvents = "none";
    this.renderer.domElement.style.position = "absolute";
    this.renderer.domElement.style.overflow = "hidden";
    this.renderer.domElement.style.boxSizing = "border-box";
    this.renderer.domElement.style.top = 0;
    this.renderer.domElement.style.left = 0;
    this.renderer.domElement.style.zIndex = 0;

    document.body.appendChild(this.renderer.domElement);
  }

  createCamera() {
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );

    this.camera.position.set(0, 0, 5);
  }

  createScene() {
    this.scene = new THREE.Scene();
  }

  update(scroll) {
    //Liquidbackground
    if (this.liquidBackground) {
      this.liquidBackground.update(scroll);
    }

    if (this.canvasPage) {
      this.canvasPage.update(scroll);
    }
    this.renderer.render(this.scene, this.camera);
  }

  createLiquidBackground() {
    this.liquidBackground = new LiquidBackground({
      wrapper: document.querySelector(".lenis>div"),
      scene: this.scene,
      renderer: this.renderer,
      sizes: this.sizes,
    });
  }

  createHome() {
    this.home = new Home({
      scene: this.scene,
      sizes: this.sizes,
      renderer: this.renderer,
      camera: this.camera,
    });
  }

  /**
   * Events.
   */

  onPreloaded() {
    this.createHome({ scene: this.scene, sizes: this.sizes });
    this.onChange({ template: this.template, isPreloaded: true });
  }

  onResize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();

    const fov = this.camera.fov * (Math.PI / 180);
    const height = 2 * Math.tan(fov / 2) * this.camera.position.z;
    const width = height * this.camera.aspect;

    this.sizes = { width, height };
    if (this.home && this.home.onResize) {
      this.home.onResize(this.sizes);
    }

    //LiquidBackground
    if (this.liquidBackground) {
      this.liquidBackground.onResize(this.sizes);
    }
  }

  onChange({ template, isPreloaded }) {
    //LiquidBackground
    if (this.liquidBackground) {
      this.liquidBackground.setWrapper(document.querySelector(".lenis>div"));
    }

    if (this.home) this.home.hide();
    if (template === "home") {
      this.canvasPage = this.home;
    }
    if (this.canvasPage) {
      this.canvasPage.show(isPreloaded);
    }
    this.template = template;
  }
}
