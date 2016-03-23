"use strict";
var utils = require("../common/utils");
var NoteVM = (function () {
    function NoteVM() {
        var _this = this;
        this.title = ko.observable();
        this.content = ko.observable();
        this.posX = ko.observable(0);
        this.posY = ko.observable(0);
        this.style = ko.computed(function () {
            var posX = _this.posX();
            var posY = _this.posY();
            return {
                top: posY ? posY + "px" : "0",
                left: posX ? posX + "px" : "0",
                display: posX != null && posY != null ? "block" : "none"
            };
        });
    }
    NoteVM.prototype.update = function (plain) {
        this.title(plain.title);
        this.content(plain.content);
        this.posX(plain.posX);
        this.posY(plain.posY);
    };
    NoteVM.prototype.toPlain = function () {
        var result = {};
        AddTruthyValue(result, "title", this.title());
        AddTruthyValue(result, "content", this.content());
        AddNumberValue(result, "posX", this.posX());
        AddNumberValue(result, "posY", this.posY());
        return result;
    };
    return NoteVM;
})();
exports.NoteVM = NoteVM;
function AddTruthyValue(destination, key, value) {
    if (value) {
        destination[key] = value;
    }
}
function AddNumberValue(destination, key, value) {
    if (Object.prototype.toString.call(value) == "[object Number]") {
        destination[key] = value;
    }
}
var BoardVM = (function () {
    function BoardVM() {
        var _this = this;
        this.name = ko.observable();
        this.color = ko.observable();
        this.notes = ko.observableArray([]);
        this.notesById = {};
        this.newNote = function () {
            var note = _this.createNote();
            note.posX(0);
            note.posY(0);
            return note;
        };
        this.removeNote = function (note) {
            _this.deleteNote(note.id);
        };
    }
    BoardVM.prototype.createNote = function (id) {
        if (id === void 0) { id = null; }
        id = id || utils.randomString();
        var note = new NoteVM();
        note.id = id;
        note.title("Title here");
        note.content("Content here");
        this.notesById[id] = note;
        this.notes.push(note);
        return note;
    };
    BoardVM.prototype.deleteNote = function (id) {
        var note = this.notesById[id];
        delete this.notesById[id];
        this.notes.remove(note);
    };
    BoardVM.prototype.update = function (plain) {
        this.name(plain.name);
        this.color(plain.color);
        var notes = plain.notes || {};
        for (var id in notes) {
            var noteVM = this.notesById[id];
            if (!noteVM) {
                noteVM = this.createNote(id);
            }
            noteVM.update(notes[id]);
        }
        for (var id in this.notesById) {
            if (!notes[id]) {
                this.deleteNote(id);
            }
        }
    };
    BoardVM.prototype.clearBoard = function () {
        this.notes.removeAll();
    };
    BoardVM.prototype.toPlain = function () {
        var result = {};
        AddTruthyValue(result, "name", this.name());
        AddTruthyValue(result, "color", this.color());
        var noteVMs = this.notes();
        if (noteVMs.length) {
            var notes = {};
            for (var i in noteVMs) {
                var noteVM = noteVMs[i];
                notes[noteVM.id] = noteVM.toPlain();
            }
            result.notes = notes;
        }
        return result;
    };
    BoardVM.prototype.applyBindings = function (rootNode) {
        ko.applyBindings(this, rootNode);
    };
    return BoardVM;
})();
exports.BoardVM = BoardVM;
