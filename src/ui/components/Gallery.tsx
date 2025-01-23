import type { MockupPreview } from "@ui/stores/MockupStore";
import { Col, Image, Row, Spin } from "antd";
import { useNavigate } from "react-router-dom";

const Gallery: React.FC<{ images: MockupPreview[] }> = ({ images }) => {
  const navigate = useNavigate();

  return (
    <Row align="middle" gutter={[12, 16]}>
      {images.length === 0 ? (
        <Col span={24} style={{ textAlign: "center" }}>
          <Spin />
        </Col>
      ) : (
        images.map((mockup) => (
          <Col key={mockup.id} span={12} sm={8} md={6} lg={4} style={{ textAlign: "center" }}>
            <a
              href={`/mockup/${mockup.id}`}
              onClick={(e) => {
                e.preventDefault();
                document.startViewTransition
                  ? document.startViewTransition(() =>
                      navigate(`/mockup/${mockup.id}`, { flushSync: true })
                    )
                  : navigate(`/mockup/${mockup.id}`, { flushSync: true });
              }}
            >
              <Image
                style={{ aspectRatio: 1, objectFit: "cover" }}
                preview={false}
                src={mockup.preview}
              ></Image>
            </a>
          </Col>
        ))
      )}
    </Row>
  );
};

export default Gallery;
