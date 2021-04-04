import 'isomorphic-fetch';

export const request = (method, url, data = {}, options) => {
  if (!method) {
    console.log('error! method=null!');
  }
  if (!url) {
    console.log('error! url=null!');
  }

  let body = null;
  if (method === 'GET' || method === 'DELETE') {
    body = null;
  } else {
    body = JSON.stringify(data);
  }

  let { headers, credentials } = {
    headers: { 'Content-Type': 'application/json' },
    credentials: true,
    ...(options || {})
  };

  let opts = {
    method,
    headers: headers,
    body
  };
  if (credentials) {
    opts = {
      ...opts,
      credentials: 'include'
    };
  }
  console.log('request', url);
  return fetch(url, opts)
    .catch(error => {
      console.error('error!', error, url, opts);
      throw new Error('网络请求失败!');
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(response.statusText);
      }
      if (response.status === 204) {
        throw new Error('没有数据');
      }
      return response;
    })
    .then(response => response.json());
  // .then(response => {
  //   let contentType = response.headers.get('content-type');
  //   //console.log ("contentType:", contentType);
  //   if (contentType.includes('application/json')) {
  //     return response.json();
  //   } else {
  //     console.log("Oops, we haven't got JSON!");
  //     return { errcode: -1, xContentType: contentType, xOrigData: response };
  //   }
  // })
  // .then(json => {
  //   if (!json.errcode) {
  //     return json;
  //   }
  //   throw json;
  // })
};

export const requestPost = (url, data = {}) => {
  return request('POST', url, data);
};

export const requestPut = (url, data = {}) => {
  return request('PUT', url, data);
};

export const requestGet = (url, options) => {
  return request('GET', url, null, options);
};

export const requestDelete = url => {
  return request('DELETE', url);
};

export default request;
