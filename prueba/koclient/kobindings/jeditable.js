/// <reference path="../../custom-typings/jquery-jeditable.d.ts" />
var a;
function register() {
    ko.bindingHandlers["jeditable"] = {
        init: function (element, valueAccessor, allBindingsAccessor) {
            var options = allBindingsAccessor().jeditableOptions || {};
            if (!options.onblur) {
                options.onblur = "submit";
            }
            $(element).editable(function (value, params) {
                valueAccessor()(value);
                return value;
            }, options);
            ko.utils.domNodeDisposal.addDisposeCallback(element, function () {
                $(element).editable("destroy");
            });
        },
        update: function (element, valueAccessor) {
            var value = ko.utils.unwrapObservable(valueAccessor());
            $(element).html(value);
        }
    };
}
exports.register = register;
