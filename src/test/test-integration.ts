
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/jasmine/jasmine.d.ts" />
/// <reference path="../../typings/socket.io-client/socket.io-client.d.ts" />

import { App } from "../common/client-app";
import * as viewModel from "../common/view-model";
import * as model from "../common/model";
import * as ko from "knockout";
import { BoardVM } from "../koclient/ko-view-model";
import {BoardService} from "../server/BoardService";

describe("Integration test between client and service", function(){
// TODO: maybe separate this two classes in a module

  class ServerMock{
  private _boardService: BoardService;
  private _clients: Array<App>;
  constructor(boardService:BoardService){
    this._boardService = boardService;
    this._clients = new Array<App>();
    var server = this;
    this._boardService.sendToClient = (changes) => {
      for(var client in server._clients){
        server._clients[client].onMessage(changes);
      }
    };
  }

  public addClient = (client: App) => {

    client.sendToServer = (changes) => {
      this._boardService.onClientMessage({patch: changes});
    };
    this._clients.push(client);
  }
}

  it("Test with one client, case one: change, client tic, change server tic.", function(){
      // Arrange
        // Prepare variables
      var boardVM: BoardVM = new BoardVM();
      var client = new App(boardVM);
      var noteVM = boardVM.createNote();
      var beginingText = "This is the begining part of the test";
      var endingText = " and this is the ending part of the test";
      var boardService = new BoardService();
      var serverMock = new ServerMock(boardService);
      serverMock.addClient(client);

      // Act
      noteVM.content(beginingText);
      client.onInterval();
      noteVM.content(noteVM.content() + endingText);
      boardService.onTic();

      //Assert
      expect(noteVM.content()).toEqual(beginingText + endingText);
    });

  it("Test with one client, case two: change, client tic, change, client tic, server tic.", function(){
      // Arrange
        // Prepare variables
      var boardVM: BoardVM = new BoardVM();
      var client = new App(boardVM);
      var noteVM = boardVM.createNote();
      var beginingText = "This is the begining part of the test";
      var endingText = " and this is the ending part of the test";
      var boardService = new BoardService();
      var serverMock = new ServerMock(boardService);
      serverMock.addClient(client);

      // Act
      noteVM.content(beginingText);
      client.onInterval();
      noteVM.content(noteVM.content() + endingText);
      client.onInterval();
      boardService.onTic();

      //Assert
      expect(noteVM.content()).toEqual(beginingText + endingText);
    });

  it("Test with one client, case three: change, client tic, server tic, change, client tic, server tic.", function(){
      // Arrange
        // Prepare variables
      var boardVM: BoardVM = new BoardVM();
      var client = new App(boardVM);
      var noteVM = boardVM.createNote();
      var beginingText = "This is the begining part of the test";
      var endingText = " and this is the ending part of the test";
      var boardService = new BoardService();
      var serverMock = new ServerMock(boardService);
      serverMock.addClient(client);

      // Act
      noteVM.content(beginingText);
      client.onInterval();
      boardService.onTic();
      noteVM.content(noteVM.content() + endingText);
      client.onInterval();
    boardService.onTic();

      //Assert
      expect(noteVM.content()).toEqual(beginingText + endingText);
    });


  it("Test with one client, case four: change, client tic, server tic, change, client tic, server tic", function(){
      // Arrange
        // Prepare variables
      var boardVM: BoardVM = new BoardVM();
      var client = new App(boardVM);
      var noteVM = boardVM.createNote();
      var beginingText = "This is the begining part of the test";
      var endingText = " and this is the ending part of the test";
      var boardService = new BoardService();
      var serverMock = new ServerMock(boardService);
      serverMock.addClient(client);

      // Act
      noteVM.content(beginingText);
      boardService.onTic();
      client.onInterval();
      boardService.onTic();
      noteVM.content(noteVM.content() + endingText);
      client.onInterval();
      boardService.onTic();

      //Assert
      expect(noteVM.content()).toEqual(beginingText + endingText);
    });

});
