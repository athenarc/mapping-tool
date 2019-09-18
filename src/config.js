export const BASE_URL = "https://app-share3d.imsi.athenarc.gr:8084"
export const ENDPOINT = {
    AUTH: {
        LOGIN: BASE_URL + '/auth/login',
        LOGOUT: BASE_URL + '/auth/logout',
        STATUS: BASE_URL + '/auth/status',
        SIGNUP: BASE_URL + '/auth/signup',
    },
    MAPPINGS: BASE_URL + '/mappings',
    LANGUAGES: BASE_URL + '/languages'
}