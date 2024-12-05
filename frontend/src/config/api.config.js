// const API_CONFIG = {
//     BASE_URL: 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com:80',
//     ENDPOINTS: {
//         CHAT_START: '/api/chat/start',
//         CHAT_MESSAGE: '/api/chat/message'
//     }
// };

// export default API_CONFIG; 

const API_CONFIG = {
    BASE_URL: 'http://k8s-default-backends-848a823787-ea2281742964f835.elb.us-east-2.amazonaws.com',
    ENDPOINTS: {
        CHAT_START: '/api/chat/message',
        CHAT_MESSAGE: '/api/chat/message'
    }
};

export default API_CONFIG;