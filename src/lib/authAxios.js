import axios from "axios";

const accessTokenRefresh = async error => {
    const { config, response : { status } } = error;

    if (status === 401) {
        console.log('accessToken refresh');
        const originalRequest = config;
        const { data : { accessToken} } = await axios.get('http://localhost:3001/user/checkLoginStatus');
        axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
    }
    return Promise.reject(error);
};

axios.interceptors.response.use(response => response, accessTokenRefresh);

export default axios;