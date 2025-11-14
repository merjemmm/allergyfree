import { API_BASE_URL } from './config'

// applies base URL and credentialing options
// url should be in the format "/route"
async function fetchAPI(url, options) {
    return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        // allow cookies wherever if in dev mode, only send to same-origin in prod
        credentials: 'include',
    })
}

function mod(n, m) {
    return ((n % m) + m) % m;
}

export { fetchAPI, mod }