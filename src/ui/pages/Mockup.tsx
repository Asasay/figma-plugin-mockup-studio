import { PLUGIN } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import PixiApp from "@ui/components/PixiApp";
import { useStore } from "@ui/providers/MobXProvider";
import { Flex, Space, Spin, Switch, Typography } from "antd";
import Button from "antd/es/button";
import { RotateRightOutlined } from "@ant-design/icons";
import { flowResult } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const MockupPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { mockupStore, pixiAppStore } = useStore();
  const { mockup, loading } = mockupStore;
  const [withBg, setWithBg] = useState(false);

  useEffect(() => {
    const fetch = flowResult(mockupStore.fetchMockupData(id!));
    fetch.catch((error) => {
      if (error.message !== "FLOW_CANCELLED") navigate("/");
    });
    return () => {
      fetch.cancel();
      mockupStore.mockup = null;
      pixiAppStore.textureStore.resetTextures();
    };
  }, [id]);

  const sendToFigma = async () => {
    const layers = await pixiAppStore.extractLayers(withBg);
    if (!layers) return;
    const { image, device, background, mask } = layers;

    UI_CHANNEL.emit(PLUGIN, "generateMockup", [
      {
        image,
        device,
        background,
        mask,
      },
    ]);
  };

  const getSelection = async () => {
    const selectedNode = await UI_CHANNEL.request(PLUGIN, "requestSelect", []);
    mockupStore.userImage = selectedNode;
  };

  const renderBody = () => {
    if (loading || !mockup || (mockup && mockup.id != id)) return <Spin />;
    else
      return (
        <>
          <PixiApp />
          <Flex gap="small" justify="space-between" wrap>
            <Flex gap="small">
              <Button
                shape="default"
                icon={<RotateRightOutlined />}
                onClick={() => pixiAppStore.sceneStore?.rotateUserImage()}
              />
              <Button onClick={getSelection}>Import</Button>
            </Flex>
            <Flex gap="small" align="center">
              <Typography.Text>With Background:</Typography.Text>
              <Switch value={withBg} onChange={setWithBg} />
              <Button type="primary" onClick={sendToFigma}>
                Export
              </Button>
            </Flex>
          </Flex>
        </>
      );
  };

  return (
    <Space size="middle" style={{ width: "100%" }} direction="vertical">
      {renderBody()}
    </Space>
  );
};

export default observer(MockupPage);
