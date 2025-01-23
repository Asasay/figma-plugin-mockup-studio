import { PLUGIN } from "@common/networkSides";
import type getUserInfo from "@plugin/handlers/getUserInfo";
import { UI_CHANNEL } from "@ui/app.network";
import { flow, flowResult, makeAutoObservable } from "mobx";

export default class UserStore {
  userId: string | null = null;
  userName: string | null = null;
  license: string | null =
    import.meta.env.MODE === "development" ? "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa" : null;
  usageCount: number | null = import.meta.env.MODE === "testing" ? 6 : null;

  constructor() {
    makeAutoObservable(this, { getUserInfo: flow }, { autoBind: true });
    flowResult(this.getUserInfo()).then(this.incrementUsageCount);
  }

  *getUserInfo() {
    const userInfo: Awaited<ReturnType<typeof getUserInfo>> = yield UI_CHANNEL.request(
      PLUGIN,
      "requestUserInfo",
      []
    );
    if (userInfo) {
      this.userId = userInfo.userId || null;
      this.userName = userInfo.userName || null;
      this.usageCount = userInfo.usageCount;
      this.license = userInfo.license;
    }
  }

  get isAuthenticated() {
    return this.userId !== null && this.userName !== "Anonymous";
  }

  incrementUsageCount() {
    if (this.usageCount !== null) {
      UI_CHANNEL.emit(PLUGIN, "incrementUsage", []);
      this.usageCount += 1;
    }
  }

  setLicense(license: string) {
    this.license = license;
  }
}
