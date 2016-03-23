/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/socket.io-client/socket.io-client.d.ts" />
/// <reference path="../custom-typings/defaults.d.ts" />
var dragNDrop = require("./kobindings/dragndrop");
dragNDrop.register();
var jEditable = require("./kobindings/jeditable");
jEditable.register();
var ko_view_model_1 = require("./ko-view-model");
var app = require("../common/client-app");
app.start(new ko_view_model_1.BoardVM());
