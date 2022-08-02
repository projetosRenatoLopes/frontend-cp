// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import "./index.css"
import api from "../../services/api"
import { AiTwotoneEdit } from 'react-icons/ai'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import formatNum from "../../utils/formatNum";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";
import { useAlert } from "react-alert";
import { FiTrash2 } from 'react-icons/fi'

const CardFeedstock = () => {
    const alerts = useAlert();
    const [gallery, setGallery] = useState([])
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [optionsMeasure, setOptions] = useState([])
    const token = localStorage.getItem('token')
    const [titleModal, setTitleModal] = useState("Cadastrar Matéria Prima")
    const [descModal, setDescModal] = useState("")
    const [quantModal, setQuantModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
    const [medModal, setMedModal] = useState("0")
    const [uuidSel, setUuidSel] = useState("")



    async function loadData() {
        const token = localStorage.getItem('token')
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
                setOptions(resposta.simplemeasure)
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.error('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
            })


        // @ts-ignore
        await api({
            method: 'GET',
            url: '/feedstock',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setGallery(resposta.feedstock)
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.error('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
            })


    }

    useEffect(() => {
        loadData()
    }, [])

    // eslint-disable-next-line no-unused-vars

    const RenderOptions = (optionMeasure) => {

        return (
            <option key={optionMeasure.uuid} value={optionMeasure.uuid}>{optionMeasure.name} - {optionMeasure.quantity} {optionMeasure.typemeasure}</option>
        )
    }

    function openModal() {
        setTitleModal("Cadastrar Matéria Prima")
        setDescModal("")
        setQuantModal("")
        setMedModal("0")
        setPriceModal("")
        setUuidSel("")
        setOpen(true)
    }

    // @ts-ignore
    const verifyNum = (el) => {
        // @ts-ignore
        const num = document.getElementById(`${el}`)['value']
        // @ts-ignore
        document.getElementById(`${el}`)['value'] = formatNum(num)
    }

    const saveMeasure = () => {
        const desc = document.getElementById('desc')['value']
        const quantity = document.getElementById('quantity')['value']
        const sel = document.getElementById('sel')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alerts.info('Insira a quantidade')
        } else if (sel === "0") {
            alerts.info('Selecione o tipo de medida')
        } else if (price === "") {
            alerts.info('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'POST',
                url: '/feedstock',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "name": desc,
                    "measurement": sel,
                    "quantity": quantity,
                    "price": price
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    if (resposta.status === 201) {
                        alerts.success(resposta.message)
                        setOpen(false)
                        loadData()
                    } else {
                        alerts.info(resposta.message)
                    }
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alerts.error('Erro 404 - Requisição invalida')
                    } else if (resposta.status === 401) {
                        alerts.error('Não autorizado')
                    } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                })
        }
    }

    const updateMeasure = () => {
        const desc = document.getElementById('desc')['value']
        const quantity = document.getElementById('quantity')['value']
        const sel = document.getElementById('sel')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alerts.info('Insira a quantidade')
        } else if (sel === "0") {
            alerts.info('Selecione o tipo de medida')
        } else if (price === "") {
            alerts.info('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'PUT',
                url: '/feedstock',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "uuid": uuidSel,
                    "name": desc,
                    "measurement": sel,
                    "quantity": quantity,
                    "price": price
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    alerts.success(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setTitleModal("Cadastrar Matéria Prima")
                        setDescModal("")
                        setQuantModal("")
                        setMedModal("0")
                        setPriceModal("")
                        setUuidSel("")
                    }
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alerts.error('Erro 404 - Requisição invalida')
                    } else if (resposta.status === 401) {
                        alerts.error('Não autorizado')
                    } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                })
        }
    }

    function checkModalOpen() {
        if (titleModal === "Cadastrar Matéria Prima") {
            saveMeasure()
        } else {
            updateMeasure()
        }

    }

    const RenderCards = (item) => {
        function openEdit() {
            setUuidSel(item.uuid)
            setTitleModal("Editar Matéria Prima")
            setDescModal(item.name)
            setQuantModal(item.quantity)
            setMedModal(item.measurementid)
            setPriceModal(`R$ ${item.price.replace(/[.]/, ',')}`)
            setOpen(true)
        }

        const deleteFeedstock = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                var resposta;
                // @ts-ignore
                api({
                    method: 'DELETE',
                    url: '/feedstock',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: {
                        "uuid": item.uuid,
                    }
                })
                    .then(async resp => {
                        resposta = resp.data;
                        loadData()
                        alerts.success(resposta.message)
                    }).catch(error => {
                        resposta = error.toJSON();
                        if (resposta.status === 404) {
                            alerts.error('Requisição invalida')
                        } else if (resposta.status === 401) {
                            alerts.error('Matéria Prima sendo utilizada por Produção')
                        } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                    })
            }
        }
        const qtdPrice = `${item.quantity} ${(item.measurement).toLowerCase()} - R$ ${item.price.replace(/[.]/, ',')}`
        return (<>
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p>{item.name}</p>
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                </div>
                <div className="bottom-card">
                    {qtdPrice}
                    <div className="btn-excluir" onClick={deleteFeedstock}>Excluir <FiTrash2 /></div>
                </div>
            </div>
        </>
        )
    }


    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '70%',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };

    return (
        <>
            <div className="area-button">
                <button className="btn-co btn-l btn-g" onClick={() => openModal()}>Adicionar</button>
            </div>
            {gallery.map(RenderCards)}
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>{titleModal}</strong>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="modal-inputs-reg">
                            <input className="modal-input modal-measure-desc" id="desc" placeholder="Descrição" defaultValue={descModal}></input>
                            <input className="modal-input modal-measure-quantity" onChange={() => verifyNum('quantity')} id="quantity" defaultValue={quantModal} placeholder="Quantidade"></input>
                            <select className="modal-input modal-measure-typemeasure" id="sel" defaultValue={medModal}>
                                <option value='0' hidden >Tipo de medida</option>
                                {optionsMeasure.map(RenderOptions)}
                            </select>
                            <input className="modal-input modal-measure-price" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de custo"></input>
                        </div>
                        <div className="modal-button">
                            <button className="btn-co btn-l btn-g" onClick={checkModalOpen}>Salvar</button>
                        </div>
                    </Typography>
                </Box>
            </Modal >
        </>
    )
}

export default memo(CardFeedstock);