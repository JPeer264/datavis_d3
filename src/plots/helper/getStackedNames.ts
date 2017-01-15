export const getStackedNames = (objectWithNames, delimiter = '&') => {
    let string = '';
    let isFirstLoop = true;

    for (let key in objectWithNames) {
        let prefix = delimiter;

        if (isFirstLoop) {
            prefix = '';

            isFirstLoop = false;
        }

        string += ' ' + prefix + ' ' + objectWithNames[key].name
    }

    return string;
};
