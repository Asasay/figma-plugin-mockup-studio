import appendImage from "./appendImage";

interface MockupLayers {
  image: Base64URLString;
  mask: string;
  background: string | null;
  device: Base64URLString;
}

export default async function generateMockup(payload: MockupLayers) {
  if (figma.editorType === "figma" || figma.editorType === "figjam") {
    const frame = figma.createNodeFromSvg(payload.mask);
    const maskNode = frame.children[0] as VectorNode;
    maskNode.name = "Mask";

    const userImage = await appendImage(payload.image, "Your Image");
    frame.resizeWithoutConstraints(userImage.width, userImage.height);
    frame.appendChild(userImage);
    figma.group([userImage, maskNode], frame);
    maskNode.isMask = true;

    const device = await appendImage(payload.device, "Device");
    frame.insertChild(0, device);

    if (payload.background) {
      const background = await appendImage(payload.background, "Background");
      frame.insertChild(0, background);
    }

    figma.notify("SVG mask applied and layered over background!");
  }
}
