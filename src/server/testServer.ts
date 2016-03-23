import * as socketIO from "socket.io";
import * as utils from "../common/utils";
import * as model from "../common/model";
import * as rfc6902 from "rfc6902";

export var io = socketIO.listen(5000);

var shadow : model.Board = { },
    current : model.Board = utils.clone(shadow);

io.on("connection", function (socket){
  console.log("connection");

  // Send to client the board
  socket.emit( "board", { board: shadow } );

  socket.on("board", function(msg: model.Message) {
    var patch = (<model.PatchMessage>msg).patch;
    if (patch) {
      console.log(socket.id);
      console.log(patch);
      var output = rfc6902.applyPatch(current, patch);
    }
  });
});

var interval = 1000;
setInterval(function() {
  // I am clonnig patch because the created objects has the same reference

  var changes = utils.clone(rfc6902.createPatch(shadow, current));
  if (changes.length) {
    rfc6902.applyPatch(shadow, changes);
    io.emit("board", { patch: changes });
  }
}, interval);
