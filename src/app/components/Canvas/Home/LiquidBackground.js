import * as THREE from "three";
import vertexShader from "@shaders/liquidBackground/liquid-vertex.glsl";
import fragmentShader from "@shaders/liquidBackground/liquid-fragment.glsl";
import simVertexShader from "@shaders/liquidBackground/sim-vertex.glsl";
import simFragmentShader from "@shaders/liquidBackground/sim-fragment.glsl";
import { mouse } from "@utils/mousePos";
import GUI from "lil-gui";

export default class LiquidBackground {
  constructor({ element, group, sizes, renderer }) {
    this.mouse = mouse;
    this.renderer = renderer;
    this.element = element;
    this.group = group;
    this.sizes = sizes;
    console.log(this.sizes);
    this.mouseAbsolute = { x: 0, y: 0 };

    this.createRenderTargets();
    this.createSim();

    this.createTextures();
    this.createFinalMesh();
    // this.createGUI();
    this.addEventListeners();
  }

  createRenderTargets() {
    this.rtA = new THREE.WebGLRenderTarget(
      window.innerWidth,
      window.innerHeight,
      {
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        format: THREE.RGBAFormat,
        type: THREE.FloatType,
        wrapS: THREE.ClampToEdgeWrapping,
        wrapT: THREE.ClampToEdgeWrapping,
      }
    );

    this.rtB = this.rtA.clone();

    this.currentRT = this.rtA;
    this.previousRT = this.rtB;
  }

  createTextures() {
    const src = this.element.dataset?.src;
    if (window.PRELOADED && window.PRELOADED[src]) {
      this.image = window.PRELOADED[src];
    } else {
      this.image = this.element;
    }
    this.texture = new THREE.Texture(this.image);
    this.texture.wrapS = THREE.ClampToEdgeWrapping;
    this.texture.wrapT = THREE.ClampToEdgeWrapping;
    this.texture.needsUpdate = true;
    this.texture.minFilter = THREE.LinearFilter;
    this.texture.magFilter = THREE.LinearFilter;
    this.texture.generateMipmaps = false;
  }

  createSim() {
    this.simUniforms = {
      uPrevTexture: { value: null },
      uMouse: { value: new THREE.Vector2() },
      uTime: { value: 0.0 },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
      uDelta: { value: 1.4 },
      uViscosity: { value: 0.002 },
      uDrag: { value: 0.999 },
      uSpring: { value: 0.005 },
      uRadius: { value: 0.02 },
      uForce: { value: 2.0 },
    };

    this.simMaterial = new THREE.ShaderMaterial({
      uniforms: this.simUniforms,
      vertexShader: simVertexShader,
      fragmentShader: simFragmentShader,
    });

    this.simScene = new THREE.Scene();
    const quadGeo = new THREE.PlaneGeometry(2, 2);
    const quad = new THREE.Mesh(quadGeo, this.simMaterial);
    this.simScene.add(quad);

    this.simCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  }

  createFinalMesh() {
    this.uniforms = {
      uTexture: { value: this.texture },
      uSimTexture: { value: null },
      uResolution: {
        value: new THREE.Vector2(window.innerWidth, window.innerHeight),
      },
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
  createGUI() {
    this.gui = new GUI({ title: "Liquid Simulation" });

    // Objet qui contient les params tweakables
    this.params = {
      delta: 1.4,
      viscosity: 0.002,
      drag: 0.999,
      spring: 0.005,
      radius: 0.02, // rayon d'influence de la souris
      force: 2.0, // force du displacement de la souris
    };

    // Sliders
    this.gui
      .add(this.params, "delta", 0.1, 4.0, 0.01)
      .name("Delta")
      .onChange((v) => (this.simUniforms.uDelta.value = v));

    this.gui
      .add(this.params, "viscosity", 0.0, 0.01, 0.0001)
      .name("Viscosity")
      .onChange((v) => (this.simUniforms.uViscosity.value = v));

    this.gui
      .add(this.params, "drag", 0.9, 1.0, 0.0001)
      .name("Drag")
      .onChange((v) => (this.simUniforms.uDrag.value = v));

    this.gui
      .add(this.params, "spring", 0.0, 0.02, 0.0001)
      .name("Spring")
      .onChange((v) => (this.simUniforms.uSpring.value = v));

    this.gui.add(this.params, "radius", 0.005, 0.1, 0.001).name("Mouse Radius");
    this.gui.add(this.params, "force", 0.1, 10.0, 0.1).name("Mouse Force");
  }
  onResize(sizes) {
    this.sizes = sizes;

    const meshWidth = this.sizes.width;
    const meshHeight = this.sizes.height;

    this.rtA.setSize(window.innerWidth, window.innerHeight);
    this.rtB.setSize(window.innerWidth, window.innerHeight);

    if (this.simUniforms) {
      this.simUniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }

    if (this.uniforms.uResolution) {
      this.uniforms.uResolution.value.set(
        window.innerWidth,
        window.innerHeight
      );
    }

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

  updateY(y = 0) {
    const normalizedScroll = -y / window.innerHeight;
    this.mesh.position.y =
      this.sizes.height / 2 -
      this.mesh.scale.y / 2 -
      normalizedScroll * this.sizes.height;
  }

  update(scroll) {
    this.simUniforms.uTime.value += 0.01;

    this.updateY(scroll);

    const rect = this.element.getBoundingClientRect();

    const mouseX = (this.mouseAbsolute.x - rect.left) / rect.width;
    const mouseY = 1.0 - (this.mouseAbsolute.y - rect.top) / rect.height;

    if (mouseX >= 0 && mouseX <= 1 && mouseY >= 0 && mouseY <= 1) {
      this.simUniforms.uMouse.value.set(mouseX, mouseY);
    } else {
      this.simUniforms.uMouse.value.set(-1, -1);
    }

    this.simUniforms.uMouse.value.set(
      Math.max(0, Math.min(1, mouseX)),
      Math.max(0, Math.min(1, mouseY))
    );

    // STEP 1 : simule → écrit dans currentRT
    this.simUniforms.uPrevTexture.value = this.previousRT.texture;
    this.renderer.setRenderTarget(this.currentRT);
    this.renderer.render(this.simScene, this.simCamera);

    this.renderer.setRenderTarget(null);

    // STEP 2 : swap
    const temp = this.previousRT;
    this.previousRT = this.currentRT;
    this.currentRT = temp;

    // STEP 3 : envoie RT au shader final
    this.uniforms.uSimTexture.value = this.previousRT.texture;
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
