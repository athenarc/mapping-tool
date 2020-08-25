
import { toast } from 'react-toastify'
import * as Resources from './Resources'
/*****************************************
 *              Networking    
*****************************************/

const getMultipartHeaders = (bearer) => {
    return {
        //'Content-Type': 'multipart/form-data',
        'Authorization': bearer ? "Bearer " + getJwtToken() : getJwtToken()
    }
}
const getDefaultHeaders = (bearer) => {
    return {
        "Content-Type": "application/json",
        'Authorization': bearer ? "Bearer " + getJwtToken() : getJwtToken()
    }
}
export const addToast = (message, variant = "warning") => {
    switch (variant) {
        case Resources.TOAST.ERROR: return toast.error(message)
        case Resources.TOAST.WARNING: return toast.warn(message)
        case Resources.TOAST.SUCCESS: return toast.success(message)
        default: return toast.info(message)
    }
}

export const postData = (url, data = {}, readJson, bearer) => post(url, data, 'POST', readJson, bearer)

export const updateData = (url, data = {}, readJson, bearer) => post(url, data, 'PUT', readJson, bearer)

export const deleteData = (url, data = {}, readJson = false, bearer) => post(url, data, 'DELETE', readJson, bearer)

export const fetchData = (url, readJson = true, bearer = true) => {
    return fetch(url, { headers: getDefaultHeaders(bearer) })
        .then(response => {
            if (response.ok) return readJson ? response.json() : response
            throw Error(response.statusText)
        })
}

export const post1 = (url, data, method = 'POST', readJson = true, bearer = true) => {

    const options = {
        method: method,
        mode: "cors",
        body: JSON.stringify(data),
        headers: getDefaultHeaders(bearer),
    };
    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return readJson ? response.json() : response;
            }
            throw Error(response.statusText);
        })
}

export const post = (url, data, method = "POST", readJson = true) => {
    const options = {
      method: method,
      mode: "cors",
      body: JSON.stringify(data),
      headers: getDefaultHeaders()
    };
    return fetch(url, options)
      .then(response => {
        if (response.ok) {
          return readJson ? response.json() : response;
        } else if (response.status < 500) {
          return response.json();
        }
        throw new HttpRequestException("Unknown Error", response.status);
      })
      .then(object => {
        if (object.message && object.error) {
          throw new HttpRequestException(object);
        } else {
          return object;
        }
      });
  };


export const postUpload = (url, data, readJson = true) => {

    const options = {
        method: 'POST',
        mode: "cors",
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: data,
        headers: getMultipartHeaders(true),
    };
    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return readJson ? response.json() : response;
            }
            throw Error(response.statusText);
        })
}



const getJwtToken = () => getCredential('token')
export const getUser = () => getCredential('user')

const getCredential = (prop) => {
    const credentials = localStorage.getItem('europeana_mapping_credentials')
    if (!credentials) return null
    const parseData = JSON.parse(credentials)
    if (!parseData) return null
    return prop ? parseData[prop] : parseData
}

export const requestAccess = (url, data, credentials) => {

    const options = {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json",
            'Authorization': credentials
        },
    };
    return fetch(url, options)
        .then(response => {
            if (response.ok) {
                return response.json()
            }
            throw Error(response.statusText)
        })
}

export const getExcel = (url, data, name) => {

    var currentdate = new Date();
    var datetime = "Last Sync: " + currentdate.getDate() + "/"
        + (currentdate.getMonth() + 1) + "/"
        + currentdate.getFullYear() + " @ "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();

    return fetch(url, {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: getDefaultHeaders()
    })
        .then(function (resp) {
            return resp.blob();
        }).then(function (blob) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = name + "_" + datetime + ".xlsx";
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
        });

}


export const getFile = (url, data, filename) => {
    return fetch(url, {
        method: 'POST',
        mode: "cors",
        body: JSON.stringify(data),
        headers: getDefaultHeaders()
    })
        .then(function (resp) {
            return resp.blob();
        }).then(function (blob) {
            var url = window.URL.createObjectURL(blob);
            var a = document.createElement('a');
            a.href = url;
            a.download = filename;
            document.body.appendChild(a); // we need to append the element to the dom -> otherwise it will not work in firefox
            a.click();
            a.remove();
        });

}

class HttpRequestException {
    constructor(err) {
      this.timestamp = err.timestamp;
      this.status = err.status;
      this.error = err.error;
      this.message = err.message;
      this.path = err.path;
    }
  }