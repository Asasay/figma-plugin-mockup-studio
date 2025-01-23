import type generateMockup from "@plugin/handlers/generateMockup";
import type getUserInfo from "@plugin/handlers/getUserInfo";
import type incrementUsage from "@plugin/handlers/incrementUsage";
import type selectionBtoa from "@plugin/handlers/selectionBtoa";
import type setLicense from "@plugin/handlers/setLicense";
import type resizeWindow from "@plugin/handlers/resizeWindow";
import { Networker } from "monorepo-networker";

export const PLUGIN = Networker.createSide("Plugin-side").listens<{
  setLicense: typeof setLicense;
  incrementUsage: typeof incrementUsage;
  requestUserInfo: typeof getUserInfo;
  requestSelect: typeof selectionBtoa;
  generateMockup: typeof generateMockup;
  resizeWindow: typeof resizeWindow;
}>();

export const UI = Networker.createSide("UI-side").listens<{}>();
