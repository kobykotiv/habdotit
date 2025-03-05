module.exports = {
  // ...existing config...
  // Remove any static export settings (e.g., "exportTrailingSlash" or "output: 'export'")
  experimental: {
    outputStandalone: true, // build as a standalone server
  }
  // ...existing config...
}
