import "@ant-design/v5-patch-for-react-19";
import { UI } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import { Networker } from "monorepo-networker";
import React from "react";
import { createRoot } from "react-dom/client";
import App from "./app";

async function bootstrap() {
  Networker.initialize(UI, UI_CHANNEL);

  const rootElement = document.getElementById("root") as HTMLElement;
  const root = createRoot(rootElement);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
}

bootstrap();
