export default async function incrementUsage() {
  const usageCount = (await figma.clientStorage.getAsync("usage-count")) || 0;
  await figma.clientStorage.setAsync("usage-count", usageCount + 1);
}
