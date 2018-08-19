"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("http");
const express = require("express");
const message_1 = require("./model/message");
const user_1 = require("./model/user");
const SocketIO = require("socket.io");
const Redis = require("redis");
class ChartServer {
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.redis();
        this.sockets();
        this.listen();
    }
    createApp() {
        this.app = express();
    }
    createServer() {
        this.server = http_1.createServer(this.app);
    }
    redis() {
        this.redisClient = Redis.createClient(6379, "localhost");
        this.redisClient.on("connect", function () {
            console.log('redis connected');
        });
        this.redisClient.on("error", function (err) {
            console.log(err);
        });
    }
    config() {
        this.port = process.env.PORT || 8080;
    }
    sockets() {
        this.io = SocketIO(this.server);
    }
    listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });
        this.io.on('connect', (socket) => {
            console.log('Connected client on port %s.', this.port);
            this.checkRedisEvent(socket, this.redisClient);
            socket.on('disconnect', () => {
                clearTimeout(this.timeOut);
                this.redisClient.quit(function () {
                    console.log('redis close');
                });
                console.log('Client disconnected');
            });
        });
    }
    checkRedisEvent(socket, client) {
        const $this = this;
        client.get("event_update_comment_goods", function (err, data) {
            if (err) {
                console.error(err);
            }
            if (data) {
                console.log(data);
                $this.io.emit('message', new message_1.Message(new user_1.User("username"), data));
            }
            client.del("event_update_comment_goods");
        });
        this.timeOut = setTimeout(function () {
            $this.checkRedisEvent(socket, client);
        }, 500);
    }
    getApp() {
        return this.app;
    }
}
exports.ChartServer = ChartServer;
