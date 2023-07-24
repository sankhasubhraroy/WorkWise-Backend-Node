const socket = require('socket.io');


let users = [];

const addUser = (userId, socketId) => {
    !users.some((user) => user.userId === userId) &&
        users.push({ userId, socketId });
};

const getUser = (userId) => {
    return users.find((user) => user.userId === userId);
};

const removeUser = (socketId) => {
    users = users.filter((user) => user.socketId !== socketId);
};

const connectSocket = (server) => {
    try {
        const io = socket(server, {
            cors: {
                origin: "http://localhost:5000",
                methods: ["GET", "POST"],
                credentials: true,
            },
        });

        io.on("connection", (socket) => {
            //when ceonnect
            console.log("socket connection established: ", socket.id);

            //take userId and socketId from user
            socket.on("addUser", (userId) => {
                addUser(userId, socket.id);
                io.emit("getUsers", users);
            });

            //send and get message
            socket.on("sendMessage", ({ senderId, receiverId, content }) => {
                const user = getUser(receiverId);
                if (user) {
                    io.to(user.socketId).emit("getMessage", {
                        senderId,
                        content,
                    });
                }
            });

            //when disconnect
            socket.on("disconnect", () => {
                console.log("socket disconnected: ", socket.id);
                removeUser(socket.id);
                io.emit("getUsers", users);
            });
        });

    } catch (error) {
        console.error(error);
    }
}

module.exports = connectSocket;