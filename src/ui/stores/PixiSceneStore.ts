import { IReactionDisposer, makeAutoObservable, reaction } from "mobx";
import { Container, Sprite, Texture, PerspectiveMesh, Graphics } from "pixi.js";
import { transformCoordsFromSvg, maskFromSVG } from "./svgUtils";

import type { RootStore } from "./RootStore";

export default class PixiSceneStore {
  rootStore;
  appStore;
  disposers: IReactionDisposer[] = [];

  scene = new Container({
    label: "Root",
    isRenderGroup: true,
    interactiveChildren: false,
  });

  UI;
  bgSprite;
  deviceSprite;
  perspectiveMesh;
  transformCoords;

  get mask() {
    return this.rootStore?.mockupStore.mockup?.mask || null;
  }

  get transformPath() {
    return this.rootStore?.mockupStore.mockup?.transformPath || null;
  }

  get textures() {
    return this.appStore?.textureStore?.textures;
  }

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      scaleScene: false,
    });
    this.rootStore = rootStore;
    this.appStore = rootStore.pixiAppStore;

    this.transformCoords = this.transformPath && transformCoordsFromSvg(this.transformPath);
    this.bgSprite = new Sprite({
      label: "Background",
      texture: this.textures?.backgroundTexture || Texture.EMPTY,
      parent: this.scene,
    });
    this.deviceSprite = new Sprite({
      label: "Device",
      texture: this.textures?.deviceTexture || Texture.EMPTY,
      parent: this.scene,
    });
    this.perspectiveMesh = new PerspectiveMesh({
      texture: this.textures?.userImageTexture || Texture.EMPTY,
      verticesX: 20,
      verticesY: 20,
      label: "Transformed user image",
      parent: this.scene,
      mask: maskFromSVG(this.mask),
      ...this.transformCoords,
    });
    this.UI = this.createUI();

    this.disposers = [
      reaction(
        () => this.textures.backgroundTexture,
        (tex) => {
          if (tex) this.bgSprite.texture = tex;
        },
        { name: "set bg texture" }
      ),
      reaction(
        () => this.textures.deviceTexture,
        (tex) => {
          if (tex) {
            this.deviceSprite.texture = tex;
            this.scaleScene();
          }
        },
        { name: "set device texture and scale scene" }
      ),
      reaction(
        () => this.textures.userImageTexture,
        (tex) => {
          if (tex) this.perspectiveMesh.texture = tex;
        },
        { name: "set user image texture" }
      ),
      reaction(
        () => this.mask,
        (mask) => {
          if (mask) this.perspectiveMesh.mask = maskFromSVG(this.mask);
        },
        { name: "set mesh mask" }
      ),
      reaction(
        () => this.transformPath,
        (svg) => {
          if (svg) {
            this.transformCoords = transformCoordsFromSvg(svg);
          }
        },
        { name: "convert svg to coords" }
      ),
      reaction(
        () => this.transformCoords,
        (coords) => {
          if (coords) {
            const { x0, y0, x1, y1, x2, y2, x3, y3 } = coords;
            this.perspectiveMesh.setCorners(x0, y0, x1, y1, x2, y2, x3, y3);
          }
        },
        { name: "set mesh transform" }
      ),
    ];
  }

  deconstructor() {
    this.disposers.forEach((disposer) => disposer());
    this.scene.destroy();
  }

  scaleScene() {
    const deviceTexture = this.textures?.deviceTexture;
    const container = this.appStore.appContainer;

    if (container && deviceTexture) {
      const scaleFactor = Math.min(
        container.clientWidth / deviceTexture.width,
        container.clientHeight / deviceTexture.height
      );
      this.scene.scale.set(scaleFactor);
      this.scene.position.set(
        container.clientWidth / 2 - this.scene.width / 2,
        container.clientHeight / 2 - this.scene.height / 2
      );

      this.positionUI(this.UI);
    }
  }

  rotateUserImage(direction: "left" | "right" = "right") {
    if (this.transformCoords) {
      const { x0, y0, x1, y1, x2, y2, x3, y3 } = this.transformCoords;
      this.transformCoords =
        direction === "right"
          ? { x0: x1, y0: y1, x1: x2, y1: y2, x2: x3, y2: y3, x3: x0, y3: y0 }
          : { x0: x3, y0: y3, x1: x0, y1: y0, x2: x1, y2: y1, x3: x2, y3: y2 };
    }
  }

  private createUI() {
    const colors = this.rootStore.mockupStore.colorVariants;
    const colorSelectorFrame: Container<Graphics> = new Container({
      label: "Color picker",
      isRenderGroup: true,
      eventMode: "static",
    });

    if (!colors || colors.length === 1) return colorSelectorFrame;

    new Graphics({ alpha: 0.4, label: "bg", parent: colorSelectorFrame })
      .roundRect(0, 0, 24 + 20 * colors.length, 28, 27)
      .fill("#000000");

    colors.map((color, i) => {
      const circle = new Graphics({ eventMode: "static", label: color, parent: colorSelectorFrame })
        .circle(0, 0, 6)
        .fill(color);
      circle.position = { x: 22 + i * 20, y: 14 };
      if (color === this.rootStore.mockupStore.selectedColor?.hex) {
        const selectionOutline = new Graphics({ parent: colorSelectorFrame, label: "Selection" })
          .circle(0, 0, 6)
          .stroke({ pixelLine: true });
        selectionOutline.position = circle.position;
      }
    });
    colorSelectorFrame.on("pointertap", ({ target }) => {
      if (target.label === "bg" || target.label === "Color picker") return;
      this.rootStore.mockupStore.setSelectedColor(target.label);
      colorSelectorFrame.getChildByLabel("Selection")!.position = target.position;
    });
    this.positionUI(colorSelectorFrame);
    return colorSelectorFrame;
  }

  private positionUI(colorSelectorFrame: Container) {
    colorSelectorFrame.pivot.set(colorSelectorFrame.width / 2, colorSelectorFrame.height);
    colorSelectorFrame.position.set(
      this.appStore.app.renderer.width / 2,
      this.appStore.app.renderer.height - 20
    );
  }
}
