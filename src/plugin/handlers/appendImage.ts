export default async function appendImage(imageB64: Base64URLString, name: string) {
  const imgBinary = figma.base64Decode(imageB64);
  const img = figma.createImage(imgBinary);
  const node = figma.createRectangle();

  const { width, height } = await img.getSizeAsync();
  node.resize(width, height);
  node.fills = [
    {
      type: "IMAGE",
      imageHash: img.hash,
      scaleMode: "FILL",
    },
  ];
  node.name = name;
  return node;
}
