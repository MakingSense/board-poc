"use strict";
var server = require("../server/testServer");
var clientApplication = require("../common/client-app");
var ko_view_model_1 = require("../koclient/ko-view-model");
var io = require("socket.io-client");
var options = {
    transports: ["websocket"],
    "force new connection": true
};
describe("Server Tests", function () {
    var board;
    var lServer;
    var clientApp;
    beforeEach(function () {
        board = new ko_view_model_1.BoardVM();
        lServer = server;
        clientApplication.start(board);
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
