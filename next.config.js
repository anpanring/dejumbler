/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb+srv://anpanring:redA1mond88@dejumbler.37nxk.mongodb.net/dejumbler?retryWrites=true&w=majority",
    IRON_PW: "2B-V!ZY_BpywE3ba!8rLLyQCeMErtb7v",
  }
}

module.exports = {
  nextConfig
}