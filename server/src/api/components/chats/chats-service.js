const chatsRepository = require('./chats-repository');

async function sendChat(
    serviceId,
    userId,
    userName,
    message,
    file,
    status,
    replyTo
) {
    return chatsRepository.sendChat(
        serviceId,
        userId,
        userName,
        message,
        file,
        status,
        replyTo
    );
}

async function getAllChats(serviceId) {
    return chatsRepository.getAllChats(serviceId);
}

async function deleteChats(serviceId) {
    return chatsRepository.deleteChats(serviceId);
}

async function markChatAsRead(chatId, userId, userName) {
    return chatsRepository.markChatAsRead(chatId, userId, userName);
}

async function markServiceChatsAsRead(serviceId, userId, userName) {
    return chatsRepository.markServiceChatsAsRead(serviceId, userId, userName);
}

module.exports = {
    sendChat,
    getAllChats,
    deleteChats,
    markChatAsRead,
    markServiceChatsAsRead,
};
