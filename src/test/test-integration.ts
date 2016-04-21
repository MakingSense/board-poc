
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
        server._clients[client].onMessage({patch: changes});
      }
    };
  }

  public addClient = (client: App) => {

    client.sendToServer = (changes) => {
      this._boardService.onClientMessage({patch: changes});
    };
    client.onMessage(this._boardService.onClientConnection());
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

	
  it("Test with two client, case one: change client 1, client1 send change, change client 2, client 2 send change, server update", function(){
     var note: model.Note = {
       title: "Title",
       content: "abc",
       posX: 10,
       posY: 10
     };
     var boardService = new BoardService({name: "board name", notes: {"note1": note}});
     var serverMock = new ServerMock(boardService);
     var boardVM1 = new BoardVM();
     var boardVM2 = new BoardVM();
     var client1 = new App(boardVM1);
     var client2 = new App(boardVM2);
     var result = "AbC";
     serverMock.addClient(client1);
     serverMock.addClient(client2);

    //  Act
    note.content = "abC";
    boardVM1.update({name: "board name", notes: {"note1": note}});
    client1.onInterval();
    note.content = "Abc";
    boardVM2.update({name: "board name", notes: {"note1": note}});
    client2.onInterval();
    boardService.onTic();

    // Assert
    expect(boardVM1.toPlain().notes).toBeDefined();
    expect(boardVM1.toPlain().notes["note1"].content).toEqual(result);
    expect(boardVM1.toPlain().notes).toBeDefined();
    expect(boardVM1.toPlain().notes["note1"].content).toEqual(result);
  });


  it("Test with two client, case two: change client 1, change client 2, server update", function(){
     var note: model.Note = {
       title: "Title",
       content: "text-base text-one text-two",
       posX: 10,
       posY: 10
     };
     var boardService = new BoardService({name: "board name", notes: {"note1": note}});
     var serverMock = new ServerMock(boardService);
     var boardVM1 = new BoardVM();
     var boardVM2 = new BoardVM();
     var client1 = new App(boardVM1);
     var client2 = new App(boardVM2);
     var result = "text-base text-ONE text-TWO";
     serverMock.addClient(client1);
     serverMock.addClient(client2);

    //  Act
    note.content = "text-base text-ONE text-two";
    boardVM1.update({name: "board name", notes: {"note1": note}});
    boardService.onTic();
    client1.onInterval();
    note.content = "text-base text-one text-TWO";
    boardVM2.update({name: "board name", notes: {"note1": note}});
    client2.onInterval();
    boardService.onTic();

    // Assert
    expect(boardVM1.toPlain().notes).toBeDefined();
    expect(boardVM1.toPlain().notes["note1"].content).toEqual(result);
    expect(boardVM1.toPlain().notes).toBeDefined();
    expect(boardVM1.toPlain().notes["note1"].content).toEqual(result);
  });

  it("When two clients send their changes at the same time, the last change that arrive is the change that are applied", function(){
      // Arrange
     var note: model.Note = {
       title: "Title",
       content: "",
       posX: 10,
       posY: 10
     };
     var boardService = new BoardService({name: "board name", notes: {"note1": note}});
     var serverMock = new ServerMock(boardService);
     var boardVM1 = new BoardVM();
     var boardVM2 = new BoardVM();
     var client1 = new App(boardVM1);
     var client2 = new App(boardVM2);
     serverMock.addClient(client1);
     serverMock.addClient(client2);

    //  Act
     note.content = "content of first client";
     boardVM1.update({name: "board name", notes: {"note1": note}});
     client1.onInterval();
     note.content = "cotent of second client";
     boardVM2.update({name: "board name", notes: {"note1": note}});
     client2.onInterval();
     boardService.onTic();

    //  Assert
     expect(boardVM1.toPlain().notes).toBeDefined();
     expect(boardVM1.toPlain().notes["note1"]).toEqual(note);
     expect(boardVM2.toPlain().notes).toBeDefined();
     expect(boardVM2.toPlain().notes["note1"]).toEqual(note);
   });

});
