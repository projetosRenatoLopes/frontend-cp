// @ts-nocheck
import InputEmail from "../components/InputEmail";
import InputPass from "../components/InputPass";
import api from "../services/api";
import React, { Fragment } from "react";
import HeaderBar from "../HeaderBar";
import { useAlert } from "react-alert";


const User = () => {
    const alert = useAlert();
    const userName = localStorage.getItem('userName')

    var user;
    if (userName === undefined) {
        user = ''
    } else {
        user = userName
    }

    const validPass = () => {
        var pass = document.getElementById('pass')["value"];
        if (pass === '') {
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-actual-pass").innerText = ("Digite sua senha atual.")
            return false;
        } else {
            cleanValidPass();
            return true;
        }
    }
    const cleanValidPass = () => {
        document.getElementById("pass").style.boxShadow = 'none';
        document.getElementById("validation-actual-pass").innerText = ("")
    }
    const validNewPass = () => {
        var pass = document.getElementById('new-pass')["value"];
        var passTwo = document.getElementById('rep-new-pass')["value"];
        if (pass === "") {
            if (passTwo === "") {
                cleanValidNewPass();
                return true
            } else {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Digite a nova senha nos dois campos.")
                return false
            }
        } else if (pass.length < '6') {
            document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-pass").innerText = ("Sua nova senha deve ter 6 dígitos ou mais.");
            return false;
        } else if (pass !== passTwo) {
            if (passTwo === "") {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Digite a nova senha nos dois campos.");
                return false;
            } else {
                document.getElementById("new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("rep-new-pass").style.boxShadow = '0px 1px 0px 0px red';
                document.getElementById("validation-pass").innerText = ("Senhas não conferem.");
                return false;
            }
        } else {
            cleanValidNewPass();
            return true;
        }
    }
    const cleanValidNewPass = () => {
        document.getElementById("new-pass").style.boxShadow = 'none';
        document.getElementById("rep-new-pass").style.boxShadow = 'none';
        document.getElementById("validation-pass").innerText = ("")
    }

    const validName = () => {
        var name = document.getElementById('user')["value"];
        if (name === "") {
            document.getElementById("user").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-name").innerText = ("Digite o nome.")
            return false;
        } else if (name.length > 15) {
            document.getElementById("user").style.boxShadow = '0px 1px 0px 0px red';
            document.getElementById("validation-name").innerText = ("O campo Nome exedeu o tamanho limite de caracteres (15)")
            return false;
        } else {
            cleanValidName();
            return true;
        }
    }
    const cleanValidName = () => {
        document.getElementById("user").style.boxShadow = 'none';
        document.getElementById("validation-name").innerText = ("")
    }

    function showMessage() {
        document.getElementById("validation-actual-pass").innerText = ("Insira a nova senha somente se for alterar.")
    }

    function hideMessage() {
        document.getElementById("validation-actual-pass").innerText = ("")
    }

    async function editUser() {
        validName();
        validPass();
        validNewPass();
        if (validPass() === true && validNewPass() === true && validName() === true) {            
            const token = localStorage.getItem('token')
            const nameEdit = document.getElementById('user')['value']
            const passEdit = document.getElementById('pass')['value']
            const newPassEdit = document.getElementById('new-pass')['value']            
            const userEdited = [{ "name": nameEdit, "pass": passEdit, "newpass": newPassEdit }]
            var resposta;
            await api({
                method: 'PUT',
                url: `/admin/update`,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: userEdited
            })
                .then(async resp => {

                    resposta = resp.data;
                    alert.success('Alterações salvas com sucesso')
                    setTimeout(() => {
                        window.location.href = `/home`
                    }, 15000);
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alert.error('Erro 404 - Requisição invalida')
                    } else if (resposta.status === 401) {
                        alert.error('A senha atual está incorreta.')
                    } else { alert.show(`Erro ${resposta.status} - ${resposta.message}`) }
                })

        }
    }

    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <h5 id='msg' style={{ 'width': 'auto', 'display': 'flex', 'justifyContent': 'center', 'alignItems': 'center' }}> </h5>
                <div className="field-login">
                    <h4>Usuário: {user}</h4>
                    <InputEmail className='input-user' placeholder='Nome' defaultValue={user} />
                    <div id="validation-name"></div>
                    <InputPass id='pass' className='input-pass' placeholder='Senha atual' />
                    <div id="validation-actual-pass"></div>
                    <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }} onMouseOver={() => showMessage()} onMouseOut={() => hideMessage()}><InputPass id='new-pass' className='input-pass' placeholder='Nova senha' /></div>
                    <InputPass id='rep-new-pass' className='input-pass' placeholder='Repita a nova senha' />
                    <div id="validation-pass"></div>
                    <button type='submit' className="btn-co btn-l btn-g" style={{ 'marginTop': '15px', 'width': '150px' }} onClick={editUser}>Salvar</button>
                </div>
            </div>
        </>
    )


}

export default User;