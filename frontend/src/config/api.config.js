// const API_CONFIG = {
//     BASE_URL: 'http://localhost:8000',
//     ENDPOINTS: {
//         CHAT_START: '/api/chat/start',
//         CHAT_MESSAGE: '/api/chat/message'
//     }
// };

// export default API_CONFIG; 

const API_CONFIG = {
    BASE_URL: 'http://k8s-default-backends-3d835ba603-ad3edaa62e54a151.elb.us-east-2.amazonaws.com',
    ENDPOINTS: {
        CHAT_START: '/api/chat/message',
        CHAT_MESSAGE: '/api/chat/message'
    }
};

export default API_CONFIG;