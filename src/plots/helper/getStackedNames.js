"use strict";
exports.getStackedNames = function (objectWithNames, delimiter) {
    if (delimiter === void 0) { delimiter = '&'; }
    var string = '';
    var isFirstLoop = true;
    for (var key in objectWithNames) {
        var prefix = delimiter;
        if (isFirstLoop) {
            prefix = '';
            isFirstLoop = false;
        }
        string += ' ' + prefix + ' ' + objectWithNames[key].name;
    }
    return string;
};
