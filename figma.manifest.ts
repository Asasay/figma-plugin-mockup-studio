// https://www.figma.com/plugin-docs/manifest/
export default {
  name: "Mockup Studio",
  id: "PLUGIN-ID-GOES-HERE",
  api: "1.0.0",
  main: "plugin.js",
  ui: "index.html",
  capabilities: [],
  permissions: ["currentuser"],
  enableProposedApi: false,
  editorType: ["figma", "figjam"],
};
