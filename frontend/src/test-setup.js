// Node >= 22 defines an experimental global localStorage accessor that is
// undefined unless --localstorage-file is passed. It shadows jsdom's storage,
// so install a working in-memory implementation for tests.
const createStorage = () => {
  const store = new Map();
  return {
    getItem: (key) => (store.has(key) ? store.get(key) : null),
    setItem: (key, value) => store.set(String(key), String(value)),
    removeItem: (key) => store.delete(String(key)),
    clear: () => store.clear(),
    key: (index) => [...store.keys()][index] ?? null,
    get length() {
      return store.size;
    },
  };
};

if (typeof globalThis.window !== 'undefined') {
  Object.defineProperty(globalThis, 'localStorage', {
    value: createStorage(),
    writable: true,
    configurable: true,
  });
}
