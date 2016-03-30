"use strict";
var express = require("express");
var BoardService_1 = require("./BoardService");
var app = express();
app.use(express.static(__dirname + "/../../client"));
var httpModule = require("http");
var http = httpModule.Server(app);
var socketIO = require("socket.io");
var io = socketIO(http);
var utils = require("../common/utils");
var shadow = {};
var current = utils.clone(shadow);
var boardService = new BoardService_1.BoardService();
app.get("/", function (req, res) {
    res.redirect("/koclient.html");
    { }
});
io.on("connection", function (socket) {
    var result = boardService.onClientConnection();
    socket.emit("board", result);
    socket.on("board", boardService.onClientMessage);
});
boardService.sendToClient = function (changes) {
    io.emit("board", { patch: changes });
};
var interval = 1000;
setInterval(boardService.updateClients, interval);
exports.server = http.listen(process.env.PORT || 3000, function () {
    console.log("listening on *:3000");
});
