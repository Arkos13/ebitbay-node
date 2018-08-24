import {createServer, Server} from 'http';
import * as express from 'express';
import { MessageGoods, MessageOrder } from './model/message';
import * as SocketIO from "socket.io";
import * as Redis from "redis";
import {RedisClient} from "redis";
import * as socketioJwt from "socketio-jwt";
import * as dotenv from "dotenv";
dotenv.config();

type typeMessage = "Order" | "Goods";

/**
 * @class ChartServer
 * */
export class ChartServer {
    private  app : express.Application;
    private  server : Server;
    private io : SocketIO.Server;
    private port : string | number;
    private redisClient : Redis.RedisClient;
    private timeOut : any;

    /**
     * @class ChartServer
     * */
    constructor() {
        this.createApp();
        this.config();
        this.createServer();
        this.redis();
        this.sockets();
        this.listen();
    }

    private createApp() : void {
        this.app = express();
    }

    private createServer() {
        this.server = createServer(this.app);
    }

    private redis() {
        this.redisClient = Redis.createClient(6379, "localhost");
        this.redisClient.on("connect", function () {
            console.log('redis connected');
        });
        this.redisClient.on("error", function (err) {
            console.log(err);
        });
    }

    private config() : void {
        this.port = process.env.PORT || 8080;
    }

    private sockets() {
        this.io = SocketIO(this.server);
    }

    private listen() {
        this.server.listen(this.port, () => {
            console.log('Running server on port %s', this.port);
        });

        this.io.
            on('connection', socketioJwt.authorize({
                secret: process.env.SECRET_KEY,
                timeout: 15000,
                decodedPropertyName: ""
            })).on('authenticated', (socket: any) => {
                console.log('Connected client on port %s.', this.port);
                socket.on('join', (room: string) => {
                    socket.join(room);
                    console.log('Join to room ' + room);
                });
                this.checkRedisEvent(socket, this.redisClient);
                socket.on('disconnect', () => {
                    clearTimeout(this.timeOut);
                    this.redisClient.quit(() => {
                        console.log('redis close');
                    });
                    console.log('Client disconnected');
                });
            });
    }

    /**
     * @param socket
     * @param client {RedisClient}
     * */
    private checkRedisEvent(socket: any, client: Redis.RedisClient) : boolean | void {
        const $this = this;
        client.get("event_create_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_create_comment_goods", "Goods");
        });
        client.get("event_update_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_update_comment_goods", "Goods");
        });
        client.get("event_remove_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_remove_comment_goods", "Goods");
        });

        client.get("event_create_comment_order", function(err, data) {
            $this.sendMessage(err, data, client, "event_create_comment_order", "Order");
        });
        client.get("event_update_comment_order", function(err, data) {
            $this.sendMessage(err, data, client, "event_update_comment_order", "Order");
        });
        client.get("event_remove_comment_order", function(err, data) {
            $this.sendMessage(err, data, client, "event_remove_comment_order", "Order");
        });
        this.timeOut = setTimeout(function () {
            $this.checkRedisEvent(socket, client);
        }, 500);
    }

    /**
     * @param err {Error | null}
     * @param data {string | null}
     * @param client {RedisClient}
     * @param event {string}
     * @param typeMessage {typeMessage}
     * */
    private sendMessage(err: Error | null, data: string | null, client: Redis.RedisClient, event: string, typeMessage: typeMessage) {
        const $this = this;
        if(err) {
            console.error(err);
        }
        if(data) {
            if(typeMessage === "Order") {
                let message = new MessageOrder();
                message.fillFromJSON(data);
                $this.io.sockets.in("chat_order_" + message.order_id).emit('message', {message: message, event: event});
            } else {
                let message = new MessageGoods();
                message.fillFromJSON(data);
                $this.io.sockets.in("chat_goods_" + message.goods_id).emit('message', {message: message, event: event});
            }
        }
        client.del(event);
    }

    public getApp(): express.Application {
        return this.app;
    }
}