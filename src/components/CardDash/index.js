import React, { useEffect, useState, memo } from "react";
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
                <div className="card-dashboard card-load" key={key}>
                    <div className="top-card-dash-load">
                        <h4></h4>
                    </div>
                    <div className="body-card-dash">
                        <div className="card-load-itens">
                        </div>
                        <div className="card-load-itens">
                        </div>
                        <div className="card-load-itens">
                        </div>
                        <div className="card-load-itens">
                        </div>
                        <div className="card-load-itens">
                        </div>

                    </div>
                    <div className="bottom-card-dash card-load-itens">
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
            item1 = item2 = item3 = item4 = item5 = { name: "", value: "" };
            try {
                if (item.data[0].name !== undefined) {
                    item1 = { "name": item.data[0].name, "value": item.data[0].value.toFixed(2).replace(/[.]/, ',') }
                }
                if (item.data[1].name !== undefined) {
                    item2 = { "name": item.data[1].name, "value": item.data[1].value.toFixed(2).replace(/[.]/, ',') }
                }
                if (item.data[2].name !== undefined) {
                    item3 = { "name": item.data[2].name, "value": item.data[2].value.toFixed(2).replace(/[.]/, ',') }
                }
                if (item.data[3].name !== undefined) {
                    item4 = { "name": item.data[3].name, "value": item.data[3].value.toFixed(2).replace(/[.]/, ',') }
                }
                if (item.data[4].name !== undefined) {
                    item5 = { "name": item.data[4].name, "value": item.data[4].value.toFixed(2).replace(/[.]/, ',') }
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
                            <div className="name-item" style={{ color: "#ffffff9e" }}>Descrição</div>
                            <div className="value-item" style={{ color: "#ffffff9e" }}>{item.typevalue}</div>
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