import cloneDeep from 'lodash/cloneDeep';
export const regexEscape = str => {
  console.log('typeof string', typeof str);
  if (typeof str != 'string') return str;
  return str.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

/**
 * 注意，查询或者更新的数据体中，
 * 模糊查询用正则，前面附加$regex-，表示需要将字符串转化为正则，如： info.method=$regex-POST
 * objectId字段前面附加$objectid-，表示需要字符串转化为ObjectId，如： _id=$objectid-5ab3e164fafb4468d560fd53
 * @param {object} where
 */
export const parse$regex = where => {
  if (where) {
    const loop = args => {
      for (const prop in args) {
        if (args.hasOwnProperty(prop)) {
          let value = args[prop];
          if (typeof value === 'string') {
            if (value.startsWith('$regex-')) {
              let value2 = value.substring('$regex-'.length);
              const reg = new RegExp(value2, 'i');
              args[prop] = reg;
            }
          } else if (typeof value === 'object') {
            loop(args[prop]);
          }
        }
      }
    };
    let where2 = cloneDeep(where);
    loop(where2);
    //debug('_preArgs:', where, ', updated:', where2);
    return where2;
  }
  return where;
};

export default regexEscape;
