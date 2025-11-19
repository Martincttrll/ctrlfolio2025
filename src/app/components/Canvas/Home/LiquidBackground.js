import * as THREE from "three";
import vertexShader from "@shaders/liquid-vertex.glsl";
import fragmentShader from "@shaders/liquid-fragment.glsl";
import { mouse } from "@utils/mousePos";

export default class LiquidBackground {
  constructor({ element, group, sizes }) {
    this.mouse = mouse;
    this.element = element;
    this.group = group;
    this.sizes = sizes;
    this.mouseAbsolute = { x: 0, y: 0 };

    this.createTextures();
    this.createMesh();
    this.addEventListeners();
  }

  createTextures() {
    const src = this.element.dataset?.src;
    if (window.PRELOADED && window.PRELOADED[src]) {
      this.image = window.PRELOADED[src];
    } else {
      this.image = this.element;
    }
    this.texture = new THREE.Texture(this.image);
    this.texture.needsUpdate = true;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  createMesh() {
    this.uniforms = {
      uTexture: { value: this.texture },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0 },
    };

    this.geometry = new THREE.PlaneGeometry(1, 1);
    this.material = new THREE.ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader,
      fragmentShader,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);
    this.group.add(this.mesh);

    this.element.style.visibility = "hidden";
  }

  onResize(sizes) {
    this.sizes = sizes;
    const meshWidth = this.sizes.width;
    const meshHeight = this.sizes.height;

    const imgRatio = this.image.width / this.image.height;
    const containerRatio = meshWidth / meshHeight;

    if (containerRatio < imgRatio) {
      this.mesh.scale.y = meshHeight;
      this.mesh.scale.x = meshHeight * imgRatio;
    } else {
      this.mesh.scale.x = meshWidth;
      this.mesh.scale.y = meshHeight;
    }
    this.baseScale = this.mesh.scale.clone();
  }

  update(scroll) {
    this.uniforms.uTime.value += 0.01;

    const mouseX = this.mouseAbsolute.x / window.innerWidth;
    const mouseY = 1 - (this.mouseAbsolute.y + scroll) / window.innerHeight;

    this.uniforms.uMouse.value.set(
      Math.max(0, Math.min(1, mouseX)),
      Math.max(0, Math.min(1, mouseY))
    );
  }

  show() {}
  hide() {}

  addEventListeners() {
    window.addEventListener("mousemove", (event) => {
      this.mouseAbsolute.x = event.clientX;
      this.mouseAbsolute.y = event.clientY;
    });
  }
}
