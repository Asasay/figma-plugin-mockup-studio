import { IReactionDisposer, makeAutoObservable, flow, reaction } from "mobx";
import { Texture, Assets } from "pixi.js";
import { RootStore } from "./RootStore";

export default class PixiTextureStore {
  rootStore;
  disposers: IReactionDisposer[] = [];
  textures = {
    deviceTexture: null as Texture | null,
    userImageTexture: null as Texture | null,
    backgroundTexture: null as Texture | null,
  };

  constructor(rootStore: RootStore) {
    makeAutoObservable(this, {
      loadTexture: flow.bound,
    });
    this.rootStore = rootStore;
    this.disposers = [
      reaction(
        () => this.rootStore.mockupStore.selectedColor,
        (selectedColor) => this.loadTexture(selectedColor?.src, "deviceTexture"),
        { name: "load device texture" }
      ),
      reaction(
        () =>
          this.rootStore.mockupStore.userImage || this.rootStore.mockupStore.mockup?.placeholder,
        (img) => this.loadTexture(img, "userImageTexture"),
        { name: "load user image texture" }
      ),
      reaction(
        () => this.rootStore.mockupStore.mockup?.background,
        (background) => this.loadTexture(background, "backgroundTexture"),
        { name: "load background texture" }
      ),
    ];
  }

  *loadTexture(imgSrc: string | null | undefined, textureType: keyof typeof this.textures) {
    if (imgSrc) {
      const headers = new Headers();
      this.rootStore.userStore.license &&
        headers.append("Authorization", this.rootStore.userStore.license);
      const response: Response = yield fetch(imgSrc, { headers });

      if (!response.ok) {
        throw new Error(`Failed to fetch asset: ${response.statusText}`);
      }

      const blob: Blob = yield response.blob();
      const objectURL = URL.createObjectURL(blob);
      const texture: Texture = yield Assets.load({ src: objectURL, loadParser: "loadTextures" });
      URL.revokeObjectURL(objectURL);

      texture.source.autoGenerateMipmaps = true;
      this.textures[textureType] = texture;
    } else {
      this.textures[textureType] = Texture.WHITE;
    }
  }
  deconstructor() {
    this.disposers.forEach((disposer) => disposer());
  }

  resetTextures() {
    this.textures.backgroundTexture = null;
    this.textures.deviceTexture = null;
  }
}
