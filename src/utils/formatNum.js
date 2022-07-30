const formatNum = (num) => {
    num = num.replace(/[A-Za-z]/,'');
    num = num.replace(/\D/g, '');
    num = num.replace(/[-]/, '');
    num = num.replace(/( )+/g, ' ');    
    if(num.length < 10){
        return(num)
    } else {        
        return(`${num.slice(0, 10)}`)
    } 
}

export default formatNum;