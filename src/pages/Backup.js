import React, { useState } from "react";
import api from "../services/api"
import HeaderBar from "../HeaderBar";

const Backup = () => {
    const [btn, setBnt] = useState(<button className="btn-co btn-l btn-g" onClick={() => backup()}>Fazer backup</button>)

    async function backup() {
        const img = '/img/loading.gif'
        setBnt(<img src={img} alt='loading' style={{width:'60PX',height:'60px'}}></img>)
        const token = localStorage.getItem('token')
        var resposta;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/backup',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;                
                download('backup-data.bkpcp', JSON.stringify(resposta))
            }).catch(error => {
                // @ts-ignore
                alert('erro ao baixar dados...')
            })
            setBnt(<button className="btn-co btn-l btn-g" onClick={() => backup()}>Fazer backup</button>)
    }

    async function restoreBackup(){

    }

    function download(filename, textInput) {
        console.log('iniciando backup')
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
        element.setAttribute('download', filename);
        document.body.appendChild(element);
        element.click();
        //document.body.removeChild(element);
    }



    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p>Backup</p>
                <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
                    {btn}
                    <input type='file' id='file-bkp' name='bkpfile' accept=".bkpcp" />
                    <button className="btn-co btn-l btn-g" >Restaurar backup</button>
                </div>
            </div>
        </>
    )
}

export default Backup;