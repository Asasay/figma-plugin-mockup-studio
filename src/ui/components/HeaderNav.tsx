import React from "react";
import { DownOutlined } from "@ant-design/icons";
import type { MenuProps } from "antd";
import Dropdown from "antd/es/dropdown/dropdown";
import { Flex, Space } from "antd";

type MenuItem = Required<MenuProps>["items"][number];

const devices: MenuProps["items"] = [
  {
    label: "iPhone XS",
    key: "device-iphone-xs",
  },
  {
    label: "iPhone 5",
    key: "device-iphone-5",
  },
  {
    label: "iPhone 6",
    key: "device-iphone-6",
  },
  {
    label: "iPhone 7",
    key: "device-iphone-7",
  },
];

const hands: MenuItem[] = [
  {
    label: "Left",
    key: "hands-left",
  },
  {
    label: "Right",
    key: "hands-right",
  },
];
const orientations: MenuItem[] = [
  {
    label: "Vertical",
    key: "orientation-vertical",
  },
  {
    label: "Horizontal",
    key: "orientation-horizontal",
  },
];

const HeaderNav: React.FC = () => {
  return (
    <Flex gap={10}>
      <Dropdown menu={{ selectable: true, items: devices }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Device
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Dropdown menu={{ selectable: true, items: hands }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Hands
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
      <Dropdown menu={{ selectable: true, items: orientations }}>
        <a onClick={(e) => e.preventDefault()}>
          <Space>
            Orientation
            <DownOutlined />
          </Space>
        </a>
      </Dropdown>
    </Flex>
  );
};

export default HeaderNav;
