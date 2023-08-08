const Message = require('../../models/message');

exports.getConversationList = async (req, res) => {
    try {
        const type = req.user.type;
        const userId = req.user.id;
        let consumerId, freelancerId;

        // Check if the user is a consumer or a freelancer
        if (type === "consumer") {
            consumerId = userId;
        } else {
            freelancerId = userId;
        }

        // Find all the messages where the user is either a consumer or a freelancer
        const messages = await Message.find({ $or: [{ consumerId }, { freelancerId }] })
            .populate("consumerId", "name")
            .populate("freelancerId", "name")
            .sort({ updatedAt: -1 });

        // Create a conversation list
        const conversationList = messages.map((message) => {
            let name;
            let id;
            if (type === "consumer") {
                name = message.freelancerId.name;
                id = message.freelancerId.id;
            } else {
                name = message.consumerId.name;
                id = message.consumerId.id;
            }
            return {
                name,
                id,
                lastMessage: message.conversations[message.conversations.length - 1].content,
                lastMessageType: message.conversations[message.conversations.length - 1].contentType,
                lastMessageTime: message.updatedAt,
                unreadMessageCount: message.conversations.filter((chat) => !chat.read && chat.senderId.toString() !== userId).length,
            }
        });

        res.status(200).json({
            success: true,
            conversationList,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.getMessages = async (req, res) => {
    try {
        const type = req.user.type;
        const senderId = req.user.id;
        const receiverId = req.query.receiverId;
        let consumerId, freelancerId;

        // Check if the user is a consumer or a freelancer
        if (type === "consumer") {
            consumerId = senderId;
            freelancerId = receiverId;
        } else {
            consumerId = receiverId;
            freelancerId = senderId;
        }

        // Update the read status of the messages
        const message = await Message.findOneAndUpdate({ consumerId, freelancerId }, {
            $set: {
                "conversations.$[elem].read": true,
            }
        }, {
            arrayFilters: [{ "elem.senderId": receiverId }],
            new: true,
        });

        // If there is no ongoing conversation between the two users
        if (!message) {
            return res.status(404).json({
                success: false,
                message: "No messages found",
            });
        }

        // Extracting the chats from the message object
        const chats = message.conversations.map((chat) => {
            return {
                fromSelf: chat.senderId.toString() === senderId,
                content: chat.content,
                contentType: chat.contentType,
                read: chat.read,
            }
        });

        res.status(200).json({
            success: true,
            chats,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}

exports.sendMessage = async (req, res) => {
    try {
        const type = req.user.type;
        const senderId = req.user.id;
        const { receiverId, content, contentType } = req.body;
        let consumerId, freelancerId;

        // Check if the user is a consumer or a freelancer
        if (type === "consumer") {
            consumerId = senderId;
            freelancerId = receiverId;
        } else {
            consumerId = receiverId;
            freelancerId = senderId;
        }

        // Finding if there is any ongoing conversation between the two users
        let message = await Message.findOneAndUpdate({ consumerId, freelancerId }, {
            $push: {
                conversations: {
                    senderId,
                    content,
                    contentType,
                }
            }
        }, { new: true });

        // If there is no ongoing conversation between the two users
        if (!message) {
            message = await Message.create({
                consumerId,
                freelancerId,
                conversations: [{
                    senderId,
                    content,
                    contentType,
                }]
            });
        }

        // Extracting the chats from the message object
        const chats = message.conversations.map((chat) => {
            return {
                fromSelf: chat.senderId.toString() === senderId,
                message: chat.content,
                read: chat.read,
            }
        });

        return res.status(200).json({
            success: true,
            chats,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
}