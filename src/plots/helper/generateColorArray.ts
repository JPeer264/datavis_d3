import { chartOptions } from '../../assets/data/options';

export const generateColorArray = (options, expectedKeys): Array<String> => {
    let colorArray: Array<String> = [];

    if (options && toString.call(options) === '[object Array]') {
        for (let option of options) {
            if (chartOptions[option] && chartOptions[option].color) {
                colorArray.push(chartOptions[option].color);
            } else {
                let randomColor = "#"+((1<<24)*Math.random()|0).toString(16);

                colorArray.push(randomColor);
            }
        }
    } else {
        for (let label in expectedKeys) {
            let randomColor = "#"+((1<<24)*Math.random()|0).toString(16);

            colorArray.push(randomColor);
        }
    }

    return colorArray;
};
