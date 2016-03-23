"use strict";
var socketIO = require("socket.io");
var utils = require("../common/utils");
var rfc6902 = require("rfc6902");
exports.io = socketIO.listen(5000);
var shadow = {}, current = utils.clone(shadow);
exports.io.on("connection", function (socket) {
    console.log("connection");
    socket.emit("board", { board: shadow });
    socket.on("board", function (msg) {
        var patch = msg.patch;
        if (patch) {
            console.log(socket.id);
            console.log(patch);
            var output = rfc6902.applyPatch(current, patch);
        }
    });
});
var interval = 1000;
setInterval(function () {
    var changes = utils.clone(rfc6902.createPatch(shadow, current));
    if (changes.length) {
        rfc6902.applyPatch(shadow, changes);
        exports.io.emit("board", { patch: changes });
    }
}, interval);
