export default async function selectionBtoa() {
  const selectedNodes = figma.currentPage.selection;

  if (selectedNodes.length !== 1) {
    figma.notify("Please select a single node.");
    return null;
  }

  const node = selectedNodes[0];

  const bytes = await node.exportAsync({
    format: "PNG",
    contentsOnly: false,
  });

  return "data:image/png;base64," + figma.base64Encode(bytes);
}
