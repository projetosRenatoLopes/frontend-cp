function formatRealRev(val) {

    const newVal = val.replace(/[.]/g, '').replace(/[A-Za-z]/, '').replace(/[$]/, '').replace(/[,]/, '.').replace(/( )+/g, '').replace(/[R$ ]/, '');
    return newVal;
}

export default formatRealRev;