import { useStore } from "@ui/providers/MobXProvider";
import { Button, Layout, Typography } from "antd";
import { Content, Header } from "antd/es/layout/layout";
import { observer } from "mobx-react-lite";
import { Link, Outlet } from "react-router-dom";
import { ArrowLeftOutlined } from "@ant-design/icons";

function AppLayout() {
  const { userStore, mockupStore } = useStore();
  return (
    <Layout>
      <Header
        style={{
          padding: "0 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid #F4F4F4",
        }}
      >
        <Link to="/" style={{ display: "flex", gap: "8px" }}>
          {mockupStore.mockup?.name ? (
            <>
              <ArrowLeftOutlined />
              <Typography.Text strong>{mockupStore.mockup.name}</Typography.Text>
            </>
          ) : (
            <Typography.Text strong>Mockup Studio</Typography.Text>
          )}
        </Link>
        {!userStore.license && (
          <Link to="/purchase">
            <Button
              type="primary"
              // onClick={() => window.open("https://gumroad.com/" + import.meta.env.VITE_PRODUCT_ID, "_blank")}
            >
              Buy
            </Button>
          </Link>
        )}
      </Header>
      <Content style={{ padding: "20px" }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default observer(AppLayout);
