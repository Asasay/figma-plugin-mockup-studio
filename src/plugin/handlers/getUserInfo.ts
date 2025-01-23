export default async function getUserInfo() {
  return {
    usageCount: (await figma.clientStorage.getAsync("usage-count")) || 0,
    license: (await figma.clientStorage.getAsync("license")) || null,
    userId: figma.currentUser?.id,
    userName: figma.currentUser?.name,
  };
}
