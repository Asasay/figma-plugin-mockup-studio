import MockupStore from "./MockupStore";
import PixiAppStore from "./PixiAppStore";
import UserStore from "./UserStore";

export class RootStore {
  mockupStore: MockupStore;
  pixiAppStore: PixiAppStore;
  userStore: UserStore;

  constructor() {
    this.mockupStore = new MockupStore(this);
    this.pixiAppStore = new PixiAppStore(this);
    this.userStore = new UserStore();
  }
}
