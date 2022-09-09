#!/usr/bin/env node

/**
 * Module dependencies.
 */

import app from "./app";
import Debug from "debug";
import http from "http";
import socket from "./socket/socket";

const debug = Debug("branch:server");

//
/**
 * Get port from environment and store in Express.
 */

/**
 * Normalize a port into a number, string, or false.
 */

const normalizePort = (val: string) => {
  const port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
};

const port = normalizePort(process.env.PORT || "3005");
app.set("port", port);

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

new socket(server);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
//server.on('error', onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr?.port;
  debug("Listening on " + bind);
}
