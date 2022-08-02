// @ts-nocheck
import api from "../services/api"
import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";

const Login = () => {

    const token = localStorage.getItem(`token`)
    if (token !== null && token !== undefined) {
        window.location.href = `/home`
    }

    const signin = async () => {        
        const user = document.getElementById('user')['value']
        const pass = document.getElementById('pass')['value']
        if (user === "") {            
            document.getElementById('pass').style.boxShadow = 'none';
            document.getElementById('msg')['textContent'] = 'Insira seu usuário'
            document.getElementById('msg').style.color = 'red'
            document.getElementById('user').style.boxShadow = '0px 1px 0px 0px red';
        } else if (pass === "") {
            document.getElementById('user').style.boxShadow = 'none';
            document.getElementById('msg')['textContent'] = 'Insira sua senha'
            document.getElementById('msg').style.color = 'red'
            document.getElementById('pass').style.boxShadow = '0px 1px 0px 0px red';
        } else {


            document.getElementById('msg')['textContent'] = 'Entrando...'
            document.getElementById('msg').style.color = 'blue'

            const dadosUser = {
                "user": user,
                "password": pass
            }

            await api({
                method: 'POST',
                url: '/users/login',
                data: dadosUser,
            }).then(async res => {
                if (res.status === 204) {
                    document.getElementById('msg')['textContent'] = 'Usuário e/ou senha incorretos'
                    document.getElementById('msg').style.color = 'red'
                } else if (res.status === 200) {
                    if (res.data.token !== undefined && res.data.id !== undefined) {
                        localStorage.setItem(`token`, res.data.token)
                        localStorage.setItem(`userName`, res.data.user)
                    }
                    document.getElementById('msg')['textContent'] = res.data.name
                    document.getElementById('msg').style.color = 'green'
                    window.location.href = `/home`
                } else {
                    document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                    document.getElementById('msg').style.color = 'red'
                }
            }).catch((error) => {
                if (error.message === 'Request failed with status code 401') {
                    document.getElementById('msg')['textContent'] = `${error.name} - Você não tem permissão para entrar nesta página.`
                    document.getElementById('msg').style.color = 'red'
                } else {
                    document.getElementById('msg')['textContent'] = 'Erro ao consultar usuário! Tente novamente.'
                    document.getElementById('msg').style.color = 'red'
                }
            })
        }
    }

    return (
        <>
            <div className='bodypagelogin'>
                <div className="area-logo" >
                    <img src={'/img/LogoSemFundo.png'} alt='logo' className="logo-top"></img>
                </div>
                <div className="field-login">
                    <h5 id='msg'> </h5>

                    {/* <input type='text'  placeholder="Login" style={{ 'width': '50%' }}></input>
            <input type='password' placeholder="Senha" style={{ 'width': '50%' }}></input> */}
                    <InputEmail className='input-user' placeholder='Usuário' />
                    <InputPass id='pass' className='input-pass' placeholder='Senha' />
                    <div className="area-btn-login">
                        <button type='submit' className="btn-co btn-l btn-g btn-login" onClick={signin} >Entrar</button>
                    </div>
                </div>
            </div>
        </>
    )

}

export default Login;