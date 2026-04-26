const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro"); // Note the capital W

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Make sure "./global.css" matches the actual name and location of your CSS file
module.exports = withNativeWind(config, { input: "./global.css" });