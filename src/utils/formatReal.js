// @ts-nocheck

const formatReal = (id) => {
    var tx = document.getElementById(`${id}`)['value']
    tx = tx.replace(/[R$ ]/g, '');
    tx = tx.replace(/[.]/g, '');
    if (tx < '10') {
        tx = tx.replace(/0,00/g, '');
        tx = tx.replace(/0,0/g, '');
        tx = tx.replace(/0,/g, '');
    }
    tx = tx.replace(/\D/g, '');
    tx = tx.replace(/[A-Za-z]/, '');
    var newTx;
    if (tx.length === 0) {
        newTx = ""
    } else if (tx.length === 1) {

        newTx = `0,0${tx}`
    } else if (tx.length === 2) {

        newTx = `0,${tx.slice(0, 2)}`
    } else if (tx.length === 3) {

        newTx = `${tx.slice(0, 1)},${tx.slice(1, 3)}`
    } else if (tx.length === 4) {
        newTx = `${tx.slice(0, 2)},${tx.slice(2, 4)}`
    } else if (tx.length === 5) {

        newTx = `${tx.slice(0, 3)},${tx.slice(3, 5)}`
    } else if (tx.length >= 6) {
        newTx = `${tx.slice(0, 1)}.${tx.slice(1, 4)},${tx.slice(4, 6)}`
    }
    document.getElementById(`${id}`)['value'] = ("R$ " + newTx)
}

export default formatReal;