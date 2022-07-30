import axios from "axios";
import { useState } from 'react'

const token = localStorage.getItem('token')

const api = axios.create({
    baseURL: "https://api-custodeproducao.onrender.com",
    //baseURL: "http://192.168.0.40:8680/",
});


export const GetCustomMeasures = async (company) => {
    const [dataApi, setDataApi] = useState([]);
    var resposta;

    // @ts-ignore
    await api({
        method: 'GET',
        url: '/simplemeasure',
        headers: {
            'Content-Type': 'application/json',
            Authorization: token
        }
    })
        .then(async resp => {
            resposta = resp.data;
        }).catch(error => {
            resposta = error.toJSON();
            if (resposta.status === 404) {
                console.log('Erro 404 - Requisição invalida')
            } else if (resposta.status === 401) {
                console.log('Não autorizado')
            } else { console.log(`Erro ${resposta.status} - ${resposta.message}`) }
        })

    return dataApi;
}



export default api;
