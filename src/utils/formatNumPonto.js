const formatNumPonto = (num) => {
    num = num.replace(/[A-Za-z]/, '');
    num = num.replace(/[-]/, '');
    num = num.replace(/( )+/g, ' ');
    num = num.replace(/[^0-9\.]/, '');

    if (num.length === 1 && num === '.') {
        num = '0.'
    }

    if(num.replace(/[0-9]/g, '') === '..'){
        num = num.substring(0, num.length - 1);
    }

    if (num.length < 10) {
        return (num)
    } else {
        return (`${num.slice(0, 10)}`)
    }
}

export default formatNumPonto;