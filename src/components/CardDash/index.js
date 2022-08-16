import React, { useEffect, useState } from "react";
import { useAlert } from "react-alert";
import api from "../../services/api"
import './index.css'


const CardDash = () => {
    const alerts = useAlert();
    const [data, setData] = useState([])

    async function loadData() {
        const token = localStorage.getItem('token')
        var resposta;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/dashboard',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setData(resposta)
            }).catch(error => {
                // @ts-ignore
                setData([{ "name": "Erro ao carregar dados!" }])
            })
    }

    useEffect(() => {
        setTimeout(() => {
            loadData()
        }, 3000);
    }, [])

    if (data === undefined || data.length === 0) {

        function CardLoad(key) {
            return (<>
                <div className="card-dashboard card-load">
                    <div className="top-card-dash-load">
                        <p></p>
                    </div>
                    <div className="body-card-dash">
                        <div className="itens-card card-load-itens">
                            <div className="name-item"><p> </p></div>
                            <div className="value-item"><p> </p></div>
                        </div>
                        <div className="itens-card card-load-itens">
                            <div className="name-item" ><p> </p></div>
                            <div className="value-item" ><p> </p></div>
                        </div>
                        <div className="itens-card card-load-itens">
                            <div className="name-item" ><p> </p></div>
                            <div className="value-item" ><p> </p></div>
                        </div>
                        <div className="itens-card card-load-itens">
                            <div className="name-item" ><p> </p></div>
                            <div className="value-item" ><p> </p></div>
                        </div>
                        <div className="itens-card card-load-itens">
                            <div className="name-item"><p></p></div>
                            <div className="value-item"><p></p></div>
                        </div>
                        <div className="itens-card card-load-itens">
                            <div className="name-item"><p></p></div>
                            <div className="value-item"><p></p></div>
                        </div>
                    </div>
                    <div className="bottom-card-dash">

                    </div>

                </div>
            </>)
        }

        return (
            <>
                <div className="cards-group">
                    <CardLoad key='1' />
                    <CardLoad key='2' />
                    <CardLoad key='3' />
                    <CardLoad key='4' />
                    <CardLoad key='5' />
                </div>
            </>
        )
    } else {

        const renderCards = (item) => {
            var item1, item2, item3, item4, item5;
            item1 = item2 = item3 = item4 = item5 = { name: <></>, value: <></> };
            try {
                if (item.data[0].name !== undefined) {
                    item1 = { "name": <p>{item.data[0].name}</p>, "value": <p>{item.data[0].value.toFixed(2).replace(/[.]/, ',')}</p> }
                }
                if (item.data[1].name !== undefined) {
                    item2 = { "name": <p>{item.data[1].name}</p>, "value": <p>{item.data[1].value.toFixed(2).replace(/[.]/, ',')}</p> }
                }
                if (item.data[2].name !== undefined) {
                    item3 = { "name": <p>{item.data[2].name}</p>, "value": <p>{item.data[2].value.toFixed(2).replace(/[.]/, ',')}</p> }
                }
                if (item.data[3].name !== undefined) {
                    item4 = { "name": <p>{item.data[3].name}</p>, "value": <p>{item.data[3].value.toFixed(2).replace(/[.]/, ',')}</p> }
                }
                if (item.data[4].name !== undefined) {
                    item5 = { "name": <p>{item.data[4].name}</p>, "value": <p>{item.data[4].value.toFixed(2).replace(/[.]/, ',')}</p> }
                }
            } catch (error) {
                console.log(error)
            }
            return (<>
                <div className="card-dashboard" key={item.name}>
                    <div className="top-card-dash">
                        <h4>{item.name}</h4>
                    </div>
                    <div className="body-card-dash">
                        <div className="itens-card">
                            <div className="name-item" style={{ color: "#ffffff9e" }}><p>Descrição</p></div>
                            <div className="value-item" style={{ color: "#ffffff9e" }}><p>{item.typevalue}</p></div>
                        </div>
                        <div className="itens-card">
                            <div className="name-item" style={{ color: "red" }}>{item1.name}</div>
                            <div className="value-item" style={{ color: "red" }}>{item1.value}</div>
                        </div>
                        <div className="itens-card">
                            <div className="name-item" style={{ color: "orange" }}>{item2.name}</div>
                            <div className="value-item" style={{ color: "orange" }}>{item2.value}</div>
                        </div>
                        <div className="itens-card">
                            <div className="name-item" style={{ color: "yellow" }}>{item3.name}</div>
                            <div className="value-item" style={{ color: "yellow" }}>{item3.value}</div>
                        </div>
                        <div className="itens-card">
                            <div className="name-item" style={{ color: "#00c4ff" }}>{item4.name}</div>
                            <div className="value-item" style={{ color: "#00c4ff" }}>{item4.value}</div>
                        </div>
                        <div className="itens-card">
                            <div className="name-item">{item5.name}</div>
                            <div className="value-item">{item5.value}</div>
                        </div>
                    </div>
                    <div className="bottom-card-dash">

                    </div>

                </div>
            </>)
        }


        return (
            <>
                <div className="cards-group">
                    {data.map(renderCards)}
                </div>
            </>
        )
    }
}

export default CardDash;