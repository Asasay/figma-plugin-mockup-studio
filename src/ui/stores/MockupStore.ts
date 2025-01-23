import { flow, makeAutoObservable } from "mobx";
import { RootStore } from "./RootStore";

type DeviceImage = { hex: string; src: string };
type MockupData = {
  id: string;
  name: string;
  deviceImages: DeviceImage[];
  background: string | null;
  placeholder: string;
  mask: string;
  tags: string[];
  transformPath: string;
};
export type MockupPreview = { id: number; preview: string };

export default class MockupStore {
  rootStore;
  mockup: MockupData | null = null;
  gallery: MockupPreview[] = [];
  tags: string[] = [];

  selectedColor: DeviceImage | null = null;
  userImage: string | null = null;
  transformed: string | null = null;

  loading = false;

  constructor(rootStore: RootStore) {
    this.rootStore = rootStore;
    makeAutoObservable(this, { fetchMockupData: flow, fetchPreviews: flow }, { autoBind: true });
  }

  get colorVariants() {
    return this.mockup?.deviceImages.map((color) => color.hex);
  }

  setSelectedColor(colorHex: string) {
    this.selectedColor =
      this.mockup!.deviceImages.find((img) => img.hex === colorHex) ||
      this.mockup!.deviceImages[0] ||
      null;
  }

  *fetchMockupData(id: MockupData["id"]) {
    if (this.loading || (this.mockup && this.mockup.id == id)) return true;
    this.loading = true;
    this.mockup = null;

    try {
      const resp: Response = yield fetch(`${import.meta.env.VITE_BACKEND_URL}/mockup/${id}`);
      if (!resp.ok) throw new Error(resp.status + " " + resp.statusText);

      const json: MockupData = yield resp.json();
      json.deviceImages.forEach(
        (image) => (image.src = import.meta.env.VITE_BACKEND_URL + image.src)
      );
      json.placeholder = import.meta.env.VITE_BACKEND_URL + json.placeholder;
      json.background = json.background ? import.meta.env.VITE_BACKEND_URL + json.background : null;

      this.mockup = json;
      this.setSelectedColor(this.mockup.deviceImages[0].hex);
      this.loading = false;
    } finally {
      this.loading = false;
    }
  }

  *fetchPreviews(tags?: string) {
    this.gallery = [];
    try {
      const fetchUrl = `${import.meta.env.VITE_BACKEND_URL}/mockups`;
      const tagsQuery = tags && tags.length > 0 ? `?tags=${tags}` : "";
      const response: Response = yield fetch(fetchUrl + tagsQuery);
      if (response.ok) {
        const data: MockupPreview[] = yield response.json();
        data.forEach(
          (d) => (d.preview = `${import.meta.env.VITE_BACKEND_URL}/assets/${d.preview}`)
        );
        this.gallery = data;
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  }

  *fetchTags() {
    try {
      const response: Response = yield fetch(`${import.meta.env.VITE_BACKEND_URL}/tags`);
      if (response.ok) {
        this.tags = yield response.json();
        return this.tags;
      }
    } catch (error) {
      console.log(error);
    }
  }
}
