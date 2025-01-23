import ConfigProvider from "antd/es/config-provider";
import { BrowserRouter, MemoryRouter, Route, Routes } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import { Resizer } from "./components/Resizer";
import Home from "./pages/Home";
import MockupPage from "./pages/Mockup";
import Purchase from "./pages/Purchase";
import { MobXProvider } from "./providers/MobXProvider";
import "./styles/app.css";

const App = () => {
  return (
    <ConfigProvider
      theme={{
        components: {
          Layout: {
            headerBg: "white",
            bodyBg: "white",
          },
        },
      }}
    >
      <MobXProvider>
        <MemoryRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Home />} />
              <Route path="/purchase" element={<Purchase />} />
              <Route element={<ProtectedRoute />}>
                <Route path="/mockup/:id" element={<MockupPage />} />
              </Route>
            </Route>
          </Routes>
          <Resizer />
        </MemoryRouter>
      </MobXProvider>
    </ConfigProvider>
  );
};

export default App;
