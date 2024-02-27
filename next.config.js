const withNextIntl = require("next-intl/plugin")();

module.exports = withNextIntl({
  // domains: ["images.unsplash.com", "via.placeholder.com", "tailwindui.com"],
  images: {
    domains: ["res.cloudinary.com", "app.swifthub.net"],
  },
});
