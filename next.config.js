/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    MONGODB_URI: "mongodb+srv://anpanring:redA1mond88@dejumbler.37nxk.mongodb.net/dejumbler?retryWrites=true&w=majority",
    IRON_PW: "2B-V!ZY_BpywE3ba!8rLLyQCeMErtb7v",
    NEXTAUTH_SECRET: "KgmIMXwMV67+VgMyhbyDrOyYlJ4yK9//11XGgqrs0C8=",
    GITHUB_ID: "431d1632e7318ab66951",
    GITHUB_SECRET: "8e32a603e56b7f60a5baa0b956fce719fd295b34"
  }
}

module.exports = nextConfig