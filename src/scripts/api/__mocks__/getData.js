import storageData from "./storageData.json";

async function getData(url) {
  return Promise.resolve({
    json: () => Promise.resolve(storageData),
  });
}
