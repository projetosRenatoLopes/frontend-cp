import api from "./api"

// @ts-nocheck
const tokenValidation = () => {


    const token = localStorage.getItem('token')
    if (token !== null && token !== undefined) {
        var resposta;
        api({
            method: 'POST',
            url: '/users/validtoken',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(resp => {
                resposta = resp.data;
                if (resposta.status === 200) {
                    console.log(resposta)
                    localStorage.setItem('userName', resposta.user)
                } else {
                    localStorage.removeItem('token')
                    window.location.href = '/login'
                }
            }).catch(error => {
                resposta = error.toJSON();
                localStorage.removeItem('token')
                window.location.href = '/login'
            })
    } else {
        window.location.href = '/login'
    }

}

export default tokenValidation;