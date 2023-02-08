const { getDefaultConfig } = require("metro-config");

// MODULE.S[AC]SS SETUP & SVG setup
module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts }
  } = await getDefaultConfig();
  return {
    transformer: {
      babelTransformerPath: require.resolve("./customTransformer.js")
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== "svg" && ext!=="scss"),
      sourceExts: [...sourceExts, "svg", "scss", "sass"]
    }
  };
})();