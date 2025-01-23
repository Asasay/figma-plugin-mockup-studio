import { PLUGIN } from "@common/networkSides";
import { UI_CHANNEL } from "@ui/app.network";
import { useStore } from "@ui/providers/MobXProvider";
import { Button, Form, FormProps, Input } from "antd";
import { useNavigate } from "react-router-dom";

type FieldType = {
  license_key: string;
};

function Purchase() {
  const { userStore } = useStore();
  const navigate = useNavigate();

  const onFinish: FormProps<FieldType>["onFinish"] = async (values) => {
    const requestBody = new URLSearchParams();
    requestBody.append("product_id", import.meta.env.VITE_PRODUCT_ID);
    requestBody.append("license_key", values.license_key);
    requestBody.append("increment_uses_count", "true");
    const response = await fetch("https://api.gumroad.com/v2/licenses/verify", {
      method: "POST",
      body: requestBody,
    });
    const data = await response.json();
    if (data.success) {
      UI_CHANNEL.emit(PLUGIN, "setLicense", [values.license_key]);
      userStore.setLicense(values.license_key);
    }
    navigate("/");
  };

  return (
    <Form
      name="lck_form"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      style={{ maxWidth: 600 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      autoComplete="off"
    >
      <Form.Item<FieldType>
        label="License Key:"
        name="license_key"
        rules={[
          { required: true, message: "Please input license key!" },
          { len: 35, message: "License key should be 35 characters long" },
        ]}
      >
        <Input showCount maxLength={35} />
      </Form.Item>

      <Form.Item label={null} wrapperCol={{ sm: { span: 16, offset: 8 } }}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>
  );
}

export default Purchase;
