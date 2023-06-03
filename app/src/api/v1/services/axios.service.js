const axios = require("axios");

async function axiosResponse(response) {
    if (response.status == 200) {
        return response.data;
    } else {
        console.log(response.message);
        return false;
    }
}

module.exports = {
    get: async (endpoint, token) => {
        try {
            let config = {
                method: "get",
                url: endpoint,
                headers: {
                    "Content-Type": "application/json",
                },
            };
            if (token) {
                config.headers.Authorization = token
            }
            
            let response = await axios(config)
            return axiosResponse(response);
        } catch (error) {
            return axiosResponse(error);
        }
    }
}