"use strict";
var server = require("../server/testServer");
var BoardService_1 = require("../server/BoardService");
var io = require("socket.io-client");
var options = {
    transports: ["websocket"],
    "force new connection": true
};
describe("Server Tests", function () {
    it("A client connect to the board server, it's recive the board", function (done) {
        var board = new BoardService_1.BoardService();
        board.sendToClient = function () {
        };
    });
    it("Client stablish a connection and recibe the board", function (done) {
        var aux = server;
        var client = io.connect("http://localhost:5000", options);
        client.on("board", function (msg) {
            var board = msg.board;
            expect(board).toBeDefined();
            done();
        });
    });
});
