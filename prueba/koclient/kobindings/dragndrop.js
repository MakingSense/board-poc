function register() {
    var _dragged;
    var _xFix;
    var _yFix;
    ko.bindingHandlers["drag"] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            element.setAttribute("draggable", "true");
            element.addEventListener("dragstart", function (e) {
                e.dataTransfer.setData("data", "data");
                _xFix = e.clientX - viewModel.posX();
                _yFix = e.clientY - viewModel.posY();
                _dragged = viewModel;
            }, false);
        }
    };
    ko.bindingHandlers["drop"] = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel) {
            element.addEventListener("dragover", function (e) {
                e.preventDefault();
                return false;
            });
            element.addEventListener("drop", function (e) {
                _dragged.posX(e.clientX - _xFix);
                _dragged.posY(e.clientY - _yFix);
                return false;
            });
        }
    };
}
exports.register = register;
