
import { toast } from 'react-toastify'
import * as Resources from './Resources'
/*****************************************
 *              Networking    
*****************************************/

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

export const post = (url, data, method = 'POST', readJson = true, bearer = true) => {

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