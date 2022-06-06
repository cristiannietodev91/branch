// For React Native version 0.59 or later
const upstreamTransformer = require("metro-react-native-babel-transformer");
const sassTransformer = require("react-native-sass-transformer");
const svgTransformer = require("react-native-svg-transformer");

module.exports.transform = function ({ src, filename, options }) {
  if (filename.endsWith(".scss") || filename.endsWith(".sass")) {
    var opts = Object.assign(options, {
      sassOptions: {
        functions: {
          "rem($px)": (px) => {
            px.setValue(px.getValue() / 16);
            px.setUnit("rem");
            return px;
          },
        },
      },
    });
    return sassTransformer.transform({ src, filename, options: opts });
  } else if (filename.endsWith(".svg")) {
    return svgTransformer.transform({ src, filename, options });
  } else {
    return upstreamTransformer.transform({ src, filename, options });
  }
};
