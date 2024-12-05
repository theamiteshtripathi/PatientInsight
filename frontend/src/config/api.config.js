// const API_CONFIG = {
//     BASE_URL: 'http://localhost:8000',
//     ENDPOINTS: {
//         CHAT_START: '/api/chat/start',
//         CHAT_MESSAGE: '/api/chat/message'
//     }
// };

// export default API_CONFIG; 

const API_CONFIG = {
    BASE_URL: 'http://k8s-default-backends-fc99b5e612-adfcb23dcde39b3b.elb.us-east-2.amazonaws.com',
    ENDPOINTS: {
        CHAT_START: '/api/chat/message',
        CHAT_MESSAGE: '/api/chat/message'
    }
};

export default API_CONFIG;