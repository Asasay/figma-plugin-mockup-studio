export default async function setLicense(license: string) {
  figma.clientStorage.setAsync("license", license);
}
