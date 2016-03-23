/// <reference path="../../node_modules/rfc6902/rfc6902.d.ts" />
var rfc6902 = require("rfc6902");
var utils = require("./utils");
exports.defaultConfiguration = {
    rootNode: null,
    socketEventName: "board",
    throttlingInterval: 1000
};
function start(boardVM, config) {
    var app = new App(boardVM, config);
    app.start();
    return app;
}
exports.start = start;
var App = (function () {
    function App(boardVM, config) {
        var _this = this;
        this.shadowClient = {};
        this.initializateShadowServer = function (board) {
            _this.shadowClient = board;
            _this.boardVM.update(_this.shadowClient);
        };
        this.onMessage = function (msg) {
            var board = msg.board;
            var patch = msg.patch;
            if (board) {
                _this.initializateShadowServer(board);
            }
            else if (patch) {
                _this.applyServerPatch(patch);
            }
        };
        this.onInterval = function () {
            var current = _this.boardVM.toPlain();
            var myChanges = rfc6902.createPatch(_this.shadowClient, current);
            if (myChanges.length) {
                _this.shadowClient = current;
                _this.socket.emit(_this.config.socketEventName, { patch: myChanges });
            }
        };
        this.boardVM = boardVM;
        this.config = utils.extend({}, exports.defaultConfiguration, config);
    }
    App.prototype.applyServerPatch = function (serverChanges) {
        var current = this.boardVM.toPlain();
        rfc6902.applyPatch(current, utils.clone(serverChanges));
        rfc6902.applyPatch(this.shadowClient, utils.clone(serverChanges));
        this.boardVM.update(current);
    };
    App.prototype.start = function () {
        this.boardVM.applyBindings(this.config.rootNode);
        this.socket = io();
        this.socket.on(this.config.socketEventName, this.onMessage);
        setInterval(this.onInterval, this.config.throttlingInterval);
    };
    return App;
})();
exports.App = App;
