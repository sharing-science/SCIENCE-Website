const getLocalStorageObject = (name) => {
  const retrievedObject = localStorage.getItem(name);
  if (!retrievedObject) return null;
  return JSON.parse(retrievedObject);
};

export { getLocalStorageObject };
