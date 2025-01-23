import { SearchOutlined } from "@ant-design/icons";
import "antd/dist/reset.css";
import Gallery from "../components/Gallery";
import { Select, Space } from "antd";
import { useStore } from "@ui/providers/MobXProvider";
import { useEffect, useState } from "react";
import { flowResult } from "mobx";
import { observer } from "mobx-react-lite";

function Home() {
  const { mockupStore } = useStore();
  const [selectedTags, setSelectedTags] = useState<string>("");

  useEffect(() => {
    const fetch = flowResult(mockupStore.fetchPreviews(selectedTags));
    fetch.catch((error) => {
      if (error.message !== "FLOW_CANCELLED") console.log(error);
    });
    return () => fetch.cancel();
  }, [selectedTags]);

  useEffect(() => {
    const fetch = flowResult(mockupStore.fetchTags());
    fetch.catch((error) => {
      if (error.message !== "FLOW_CANCELLED") console.log(error);
    });
    return () => fetch.cancel();
  }, []);

  return (
    <Space direction="vertical" size={"middle"} style={{ width: "100%" }}>
      <Select
        mode="tags"
        style={{ width: "100%" }}
        prefix={<SearchOutlined />}
        placeholder="Search mockups"
        aria-label="Mockup tags search box"
        onChange={setSelectedTags}
        options={mockupStore.tags.map((tag) => ({ label: tag, value: tag }))}
      />
      <Gallery images={mockupStore.gallery} />
    </Space>
  );
}

export default observer(Home);
