/**
 * Socket.io instance store.
 * Allows controllers to access the io instance without circular dependencies.
 */
let ioInstance = null;

module.exports = {
  setIO: (io) => {
    ioInstance = io;
  },
  getIO: () => {
    if (!ioInstance) {
      throw new Error('Socket.io not initialized');
    }
    return ioInstance;
  },
};
