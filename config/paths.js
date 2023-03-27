const path = require('path');

module.exports = {
  // Source files
  src: path.resolve(__dirname, '../src'),

  // Production build files
  build: path.resolve(__dirname, '../dist'),

  // Static files that get copied to build folder
  public: path.resolve(__dirname, '../public'),

  // Cannonjs library
  cannon: path.resolve(__dirname, '../src/lib/cannon/cannon.js'),

  // Photon Realtime Javascript SDK library
  photon: path.resolve(__dirname, '../src/lib/photon/photon.js'),
};
