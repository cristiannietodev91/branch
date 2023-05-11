import SocketIO from "socket.io-client";

const options = { transports: ["websocket"], secure: true };

export default SocketIO(process.env.VUE_APP_URLBACKSERVICES, options)