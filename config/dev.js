require('dotenv').config();

module.exports = {
    bot: {
        name: 'ксюмет',
        dev: {
            // chats: [], // если установлен, работает только в тех чатах, что в массиве
        },
    },
    vk: {
        token: process.env.VK_TOKEN,
        // call: 'execute',
        authCaptcha: 1,
    },
    additionalTokens: [],
    db: {
        uri: 'mongodb://localhost/',
        name: 'bot',
        options: {
            socketOptions: {
                socketTimeoutMS: 24000,
                keepAlive: 10000,
                connectTimeoutMs: 30000,
            }
        }
    },
    coreModules: [],
    modules: [
        new (require('../modules/CommandList')),
        new (require('../modules/Info')),
        new (require('../modules/SandBoxKsu')),
        new (require('../modules/UserProfile')),
    ]
};
