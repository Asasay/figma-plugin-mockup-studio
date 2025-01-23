import { createContext, useContext } from "react";
import { RootStore } from "../stores/RootStore";

const MobXContext = createContext<RootStore | null>(null);

export const MobXProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const store = new RootStore();
  return <MobXContext.Provider value={store}>{children}</MobXContext.Provider>;
};

export const useStore = () => {
  const store = useContext(MobXContext);
  if (!store) throw new Error("useStore must be used within StoreProvider");
  return store;
};
