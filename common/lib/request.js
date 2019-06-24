import axios from 'axios';
import qs from 'query-string';
import { ResponseError } from '@/lib/error';

class BaseRequest {
  constructor () {
    this.$http = axios.create({
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      transformResponse: [response => {
        if (!response) {
          throw new ResponseError(500, '系统服务繁忙!');
        }
        typeof response === 'string' && (response = JSON.parse(response));
        if (parseInt(response.errorCode) !== 0) {
          throw new ResponseError(response.errorCode, response.errorMessage);
        }
        return response.data || response.result;
      }],
      maxContentLength: 300000,
      responseType: 'json'
    });
  }

  get (url, params = null, config = {}) {
    return new Promise((resolve, reject) => {
      this.$http.get(url, {
        params,
        ...config
      }).then(response => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  post (url, data = null, config = {}) {
    return new Promise((resolve, reject) => {
      this.$http.post(url, data, {
        transformRequest: [request => qs.stringify(request)],
        ...config
      }).then(response => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  put (url, data = null, config = {}) {
    return new Promise((resolve, reject) => {
      this.$http.put(url, data, {
        transformRequest: [request => qs.stringify(request)],
        ...config
      }).then(response => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    });
  }

  delete (url, data = null, config = {}) {
    return new Promise((resolve, reject) => {
      this.$http.delete(url, {
        transformRequest: [request => qs.stringify(request)],
        data,
        ...config
      }).then(response => {
        resolve(response.data);
      }).catch(err => {
        reject(err);
      });
    });
  }
}

export default BaseRequest;
