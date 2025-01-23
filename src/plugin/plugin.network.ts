import { PLUGIN, UI } from "@common/networkSides";
import selectionBtoa from "./handlers/selectionBtoa";
import generateMockup from "./handlers/generateMockup";
import getUserInfo from "./handlers/getUserInfo";
import incrementUsage from "./handlers/incrementUsage";
import setLicense from "./handlers/setLicense";
import resizeWindow from "./handlers/resizeWindow";

export const PLUGIN_CHANNEL = PLUGIN.channelBuilder()
  .emitsTo(UI, (message) => {
    figma.ui.postMessage(message);
  })
  .receivesFrom(UI, (next) => {
    const listener: MessageEventHandler = (event) => next(event);
    figma.ui.on("message", listener);
    return () => figma.ui.off("message", listener);
  })
  .startListening();

// ---------- Message handlers

PLUGIN_CHANNEL.registerMessageHandler("setLicense", setLicense);
PLUGIN_CHANNEL.registerMessageHandler("incrementUsage", incrementUsage);
PLUGIN_CHANNEL.registerMessageHandler("requestUserInfo", getUserInfo);
PLUGIN_CHANNEL.registerMessageHandler("requestSelect", selectionBtoa);
PLUGIN_CHANNEL.registerMessageHandler("generateMockup", generateMockup);
PLUGIN_CHANNEL.registerMessageHandler("resizeWindow", resizeWindow);
