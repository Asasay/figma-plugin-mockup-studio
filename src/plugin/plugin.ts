import { PLUGIN } from "@common/networkSides";
import { PLUGIN_CHANNEL } from "@plugin/plugin.network";
import { Networker } from "monorepo-networker";

async function bootstrap() {
  Networker.initialize(PLUGIN, PLUGIN_CHANNEL);

  if (figma.editorType === "figma" || figma.editorType === "figjam") {
    if (import.meta.env.MODE === "development") {
      figma.clientStorage.setAsync("license", "aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }
    figma.showUI(__html__, {
      width: 440,
      height: 580,
      title: "Mockup Studio",
    });
  }
}

bootstrap();
