/// <reference path="../../node_modules/rfc6902/rfc6902.d.ts" />

// TODO: consider unify app.ts and allow it to use different view models (Knockout, React, etc)

import * as rfc6902 from "rfc6902";
import * as utils from "./utils";
import * as model from "./model";
import { IBoardVM } from "./view-model";

export interface AppConfiguration {
  rootNode?: HTMLElement;
  socketEventName?: string;
  throttlingInterval?: number;
}

export var defaultConfiguration: AppConfiguration = {
  rootNode: null,
  socketEventName: "board",
  throttlingInterval: 1000
};

export function start(boardVM: IBoardVM, config?: AppConfiguration) {
  var app = new App(boardVM);
  config = utils.extend({ }, defaultConfiguration, config);
  boardVM.applyBindings(config.rootNode);
  var socket = io();
  socket.on(config.socketEventName, app.onMessage);

  app.sendToServer = (changes) => {
      socket.emit(config.socketEventName, { patch: changes });
  };
  setInterval(app.onInterval, config.throttlingInterval);
  return app;
}

export class App {
  shadow: model.Board = { };
  boardVM: IBoardVM;
  sendToServer: (changes: any) => void;

  constructor(boardVM: IBoardVM) {
    this.boardVM = boardVM;
    this.shadow = this.boardVM.toPlain();
  }

  applyServerPatch(serverChanges: model.Patch) {
    var current = this.boardVM.toPlain();
    // I am clonnig patch because the created objects has the same reference
    rfc6902.applyPatch(this.shadow, utils.clone(serverChanges));
    rfc6902.applyPatch(current, serverChanges);
    this.boardVM.update(current);
    this.shadow = this.boardVM.toPlain();
  }

  initializateShadow = (board: model.Board) => {
    this.shadow = board;
    this.boardVM.update(this.shadow);
  };

  onMessage = (msg: model.Message) => {
    var board = (<model.BoardMessage>msg).board;
    var patch = (<model.PatchMessage>msg).patch;
    if (board) {
      this.initializateShadow(board);
    } else if (patch) {
      this.applyServerPatch(patch);
    }
  };

  onInterval= () => {
    var current = this.boardVM.toPlain();
    var myChanges = rfc6902.createPatch(this.shadow, current);
    if (myChanges.length) {
      this.sendToServer(myChanges);
    }
  };



}
