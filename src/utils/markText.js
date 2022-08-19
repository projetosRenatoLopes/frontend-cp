// @ts-nocheck
import Mark from 'mark.js';

function markText(text) {
    var elements = document.getElementsByClassName('title-card')
    for (let i = 0; i < elements.length; i++) {
        console.log(elements[i])
        var elementMark = new Mark(elements[i])
        elementMark.unmark({
            done: () => {
                elementMark.mark(text)
            }
        })
    }
}

export default markText;