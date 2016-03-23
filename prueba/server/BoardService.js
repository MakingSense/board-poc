"use strict";
var rfc6902 = require("rfc6902");
var utils = require("../common/utils");
var BoardService = (function () {
    function BoardService() {
        var _this = this;
        this.onClientConnection = function (socket) {
            console.log("new connection");
            socket.emit("board", { board: _this.shadow });
            socket.on("board", _this.onClientMessage);
        };
        this.onClientMessage = function (msg) {
            var patch = msg.patch;
            if (patch) {
                rfc6902.applyPatch(_this.current, patch);
            }
        };
        this.updateClients = function () {
            var changes = utils.clone(rfc6902.createPatch(_this.shadow, _this.current));
            if (changes.length) {
                rfc6902.applyPatch(_this.shadow, changes);
                _this.sendToClient(changes);
            }
        };
        this.shadow = {};
        this.current = utils.clone(this.shadow);
    }
    return BoardService;
})();
exports.BoardService = BoardService;
