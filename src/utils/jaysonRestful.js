export default function _getFirstOfRetrieve(result, model) {
  if (!result) return null;
  if (!result.result) return null;
  if (!result.entities) return null;

  // result.items[0]存在则直接返回.
  let item = result.items && result.items[0];
  if (item) return item;

  // result.result[0]存在则从entities中获取.
  let itemId = result.result[0];
  if (!itemId) return null;

  if (model) {
    item = result.entities[model] && result.entities[model][itemId];
    if (item) return item;
  }

  let collections = Object.getOwnPropertyNames(result.entities);
  for (let i = 0; i < collections.length; i++) {
    let collectionName = collections[i];
    let collection = result.entities[collectionName];
    item = collection && collection[itemId];
    if (item) return item;
  }
  return null;
}
