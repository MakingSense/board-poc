/// <reference path="../../typings/jasmine/jasmine.d.ts" />

import * as client from "../koclient/ko-view-model";
import * as server   from "../server/testServer";
import * as model from "../common/model";
import {BoardService} from "../server/BoardService";
import * as clientApplication from "../common/client-app";
import { BoardVM } from "../koclient/ko-view-model";
import { NoteVM } from "../koclient/ko-view-model";

var io = require("socket.io-client");
var options = {
  transports: ["websocket"],
  "force new connection": true
};

describe("Server Tests", function(){

  var board: BoardVM;
  var lServer;
  var clientApp;

  beforeEach(function(){
    board = new BoardVM();
    lServer = server;
    clientApplication.start(board);
  });

  // it("While client make changes, server doesn't resend information", function(done){
  //   var note: model.Note = {
  //     title: "titulo",
  //     content: "contenido",
  //     posX: 0,
  //     posY: 0
  //   };
  //   var noteVM = board.createNote();
  //   noteVM.update(note);
  //   var app: clientApplication.App = new clientApplication.App();
  //   var client = io.connect("http://localhost:5000", options);
  //   client.on("board", function(msg){
  //     var patch = (<model.PatchMessage>msg).patch;
  //     var board = (<model.BoardMessage>msg).board;
  //     if (board == undefined) {
  //       expect(patch).not.toBeDefined();
  //     }
  //   });
  //   for (let i = 0; i < 10; i++) {
  //     setTimeout(function(){
  //       //TODO: Deberia modificar el mensaje (que aun no fue creado)
  //       note.title += "a";
  //       noteVM.update(note);
  //     }, 1000);
  //   }
  // });

  it("Client stablish a connection and recibe the board", function(done) {

    var aux = server;
      var client = io.connect("http://localhost:5000", options);
      client.on("board", function(msg){
        var board = (<model.BoardMessage>msg).board;
        expect(board).toBeDefined();
        done();
      });
  });

});
