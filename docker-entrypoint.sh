#!/bin/sh
# Start socket server in background
node app/socket_server/socket-server.js &

# Start Next.js standalone server
node server.js
