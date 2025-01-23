import { useEffect, useRef } from "react";
import { useStore } from "@ui/providers/MobXProvider";
import { observer } from "mobx-react-lite";

const PixiApp = () => {
  const { pixiAppStore } = useStore();
  const appContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const appContainer = appContainerRef.current;
    if (!appContainer || !pixiAppStore.initialized) return;

    pixiAppStore.attach(appContainer);

    return () => {
      pixiAppStore.dettach();
    };
  }, [appContainerRef, pixiAppStore.initialized]);

  return <div ref={appContainerRef} style={{ minHeight: "400px" }}></div>;
};

export default observer(PixiApp);
