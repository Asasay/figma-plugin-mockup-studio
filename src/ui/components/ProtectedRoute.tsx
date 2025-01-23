import { useStore } from "@ui/providers/MobXProvider";
import { Button, Result } from "antd";
import { observer } from "mobx-react-lite";
import { Outlet, useNavigate } from "react-router-dom";

function ProtectedRoute() {
  const navigate = useNavigate();
  const { userStore } = useStore();
  if (!userStore.license && userStore.usageCount! > 5) {
    return (
      <Result
        status="warning"
        title="You have run out of free usages of this plugin."
        extra={[
          <Button key="main" onClick={() => navigate("/")}>
            Go Back
          </Button>,
          <Button type="primary" key="buy" onClick={() => navigate("/purchase")}>
            Buy Plugin
          </Button>,
        ]}
      />
    );
  }

  return <Outlet />;
}

export default observer(ProtectedRoute);
