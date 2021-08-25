const path = require("path");
module.exports = {
  outputDir: path.resolve(__dirname, "../Booking-Server/dist"),
  assetsDir: "../../static",
  transpileDependencies: ["vuetify"]
};
