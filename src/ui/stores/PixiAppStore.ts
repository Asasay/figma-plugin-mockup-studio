import { makeAutoObservable } from "mobx";
import { Application, Container, Graphics, RenderTexture, Texture, TilingSprite } from "pixi.js";
import type { RootStore } from "./RootStore";
import PixiSceneStore from "./PixiSceneStore";
import PixiTextureStore from "./PixiTextureStore";

export default class PixiAppStore {
  rootStore: RootStore;
  textureStore: PixiTextureStore;
  sceneStore: PixiSceneStore | null = null;

  appContainer: HTMLDivElement | null = null;
  resizeObserver = new ResizeObserver(this.resizeCB.bind(this));
  app: Application = new Application();
  appBg: TilingSprite | null = null;
  initialized = false;
  mounted = false;

  constructor(rootStore: RootStore) {
    makeAutoObservable(this);
    this.rootStore = rootStore;
    this.textureStore = new PixiTextureStore(this.rootStore);
    this.initializeApp();
  }

  initializeApp() {
    this.app
      .init({
        antialias: true,
        autoDensity: true,
        resolution: 2,
      })
      .then(() => (this.initialized = true));
  }

  attach(container: HTMLDivElement) {
    this.appContainer = container;
    this.app.resizeTo = container;
    this.resizeObserver.observe(container);
    this.mounted = true;
    this.app.canvas.title = "Mockup canvas app";
    container.replaceChildren(this.app.canvas);
    setTimeout(() => this.app.resize(), 0);
    this.sceneStore = new PixiSceneStore(this.rootStore);

    this.appBg = this.createAppBg();
    this.app.stage.addChild(this.appBg);
    this.app.stage.addChild(this.sceneStore.scene);
    this.app.stage.addChild(this.sceneStore.UI);
  }

  dettach() {
    this.mounted = false;
    this.resizeObserver.disconnect();
    this.appContainer = null;
    this.sceneStore?.deconstructor();
    this.app.stage.removeChildren();
    this.sceneStore = null;
    this.app.renderer.clear();
  }

  private resizeCB() {
    if (this.sceneStore?.scene) this.sceneStore.scaleScene();
    if (this.appBg) {
      this.appBg.width = this.app.screen.width + 300;
      this.appBg.height = this.app.screen.height;
    }
  }

  private createAppBg() {
    const size = 15;
    const graphics = new Graphics();
    graphics.rect(0, 0, size, size);
    graphics.fill("grey");
    graphics.rect(size, 0, size, size);
    graphics.fill("white");
    graphics.rect(0, size, size, size);
    graphics.fill("white");
    graphics.rect(size, size, size, size);
    graphics.fill("grey");

    const texture = this.app.renderer.generateTexture(graphics);
    const tilingSprite = new TilingSprite({
      texture,
      width: this.app.screen.width,
      height: this.app.screen.height,
      label: "Checkerboard pattern",
    });
    return tilingSprite;
  }

  async extractLayers(withBackground = false) {
    const rootBounds = this.sceneStore?.scene.getLocalBounds().rectangle;
    const extract = async (target: Container | Texture) => {
      return (
        await this.app.renderer.extract.base64({
          resolution: 1,
          target,
          frame: rootBounds,
        })
      ).split(",")[1];
    };
    if (!this.sceneStore?.mask || !rootBounds) return null;

    this.app.stop();
    const perspMesh = this.sceneStore.perspectiveMesh;
    const maskTemp = perspMesh.mask;
    perspMesh.mask = null;

    const image = await extract(perspMesh);
    const device = await extract(this.sceneStore.deviceSprite);
    const background = withBackground ? await extract(this.sceneStore.bgSprite) : null;

    this.sceneStore.perspectiveMesh.mask = maskTemp;
    this.app.start();

    return { image, device, background, mask: this.sceneStore.mask };
  }
}
