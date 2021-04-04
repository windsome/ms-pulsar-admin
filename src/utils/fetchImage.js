import 'isomorphic-fetch';

export const fetchImage = url => {
  if (!url) {
    console.log('error! url=null!');
  }

  console.log('request', url);
  return fetch(url, { method: 'GET' })
    .catch(error => {
      console.error('error!', error, url);
      throw new Error('网络请求失败!');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.status === 204) {
        throw new Error('没有数据!');
      }
      return response;
    });
};

export const fetchImageBuffer = url => {
  return fetchImage(url).then(response => {
    let contentType = response.headers.get('content-type');
    // let buffer = response.arrayBuffer();
    return response.buffer().then(buffer => ({ contentType, buffer }));
  });
};

export const fetchImageBase64 = url => {
  return fetchImageBuffer(url).then(({ contentType, buffer }) => {
    if (buffer) {
      if (
        ['image/jpg', 'image/bmp', 'image/png', 'image/jpeg'].indexOf(
          contentType
        ) >= 0
      ) {
        let base64Flag = 'data:' + contentType + ';base64,';
        // let imageStr = arrayBufferToBase64(buffer);
        let imageStr = buffer.toString('base64');
        return base64Flag + imageStr;
      }
    }
    return null;
  });
};

export const fetchImageBase64UrlEncode = url => {
  return fetchImageBuffer(url).then(({ contentType, buffer }) => {
    if (buffer) {
      if (
        ['image/jpg', 'image/bmp', 'image/png', 'image/jpeg'].indexOf(
          contentType
        ) >= 0
      ) {
        let base64Flag = 'data:' + contentType + ';base64,';
        // let imageStr = arrayBufferToBase64(buffer);
        let imageStr = buffer.toString('base64');
        return encodeURIComponent(imageStr);
        // return base64Flag + encodeURIComponent(imageStr);
      }
    }
    return null;
  });
};

function arrayBufferToBase64(buffer) {
  let binary = '';
  let bytes = [].slice.call(new Uint8Array(buffer));

  bytes.forEach(b => (binary += String.fromCharCode(b)));
  return window.btoa(binary);
  // return binary.toString('base64');
}
