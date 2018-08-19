import {createServer, Server} from 'http';
import * as express from 'express';
import { Message } from './model/message';
import { User } from './model/user';
import * as SocketIO from "socket.io";
import * as Redis from "redis";
import {RedisClient} from "redis";

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

        this.io.on('connect', (socket: any) => {
            console.log('Connected client on port %s.', this.port);
            this.checkRedisEvent(socket, this.redisClient);
            socket.on('disconnect', () => {
                clearTimeout(this.timeOut);
                this.redisClient.quit(function(){
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
    private checkRedisEvent(socket: any, client: Redis.RedisClient) {
        const $this = this;
        client.get("event_update_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_update_comment_goods");
        });
        client.get("event_create_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_create_comment_goods");
        });
        client.get("event_remove_comment_goods", function(err, data) {
            $this.sendMessage(err, data, client, "event_remove_comment_goods");
        });

        client.get("event_create_comment_order", function(err, data) {
            $this.sendMessage(err, data, client, "event_create_comment_order");
        });
        client.get("event_create_comment_update", function(err, data) {
            $this.sendMessage(err, data, client, "event_create_comment_update");
        });
        client.get("event_remove_comment_order", function(err, data) {
            $this.sendMessage(err, data, client, "event_remove_comment_order");
        });
        this.timeOut = setTimeout(function () {
            $this.checkRedisEvent(socket, client);
        }, 500);
    }

    /**
     * @param err {Error | null}
     * @param data {string}
     * @param client {RedisClient}
     * @param event {string}
     * */
    private sendMessage(err: Error | null, data: string, client: Redis.RedisClient, event: string) {
        const $this = this;
        if(err) {
            console.error(err);
        }
        if(data) {
            console.log(data);
            $this.io.emit('message', new Message(new User("username"), data));
        }
        client.del(event);
    }

    public getApp(): express.Application {
        return this.app;
    }
}