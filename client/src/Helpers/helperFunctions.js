const getLocalStorageObject = (name) => {
  const retrievedObject = localStorage.getItem(name);
  if (!retrievedObject) return {};
  return JSON.parse(retrievedObject);
};

export { getLocalStorageObject };
