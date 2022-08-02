// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import "./index.css"
import api from "../../services/api"
import { AiTwotoneEdit } from 'react-icons/ai'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import formatNum from "../../utils/formatNum";
import { FiTrash2 } from 'react-icons/fi'
import { useAlert } from "react-alert";

const CardMeasures = () => {
    const alerts = useAlert();
    const [gallery, setGallery] = useState([])
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [optionsMeasure, setOptions] = useState([])
    const token = localStorage.getItem('token')
    const [titleModal, setTitleModal] = useState("Cadastrar Medida")
    const [descModal, setDescModal] = useState("")
    const [quantModal, setQuantModal] = useState("")
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
                setGallery(resposta.simplemeasure)
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.error('Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
            })


        // @ts-ignore
        await api({
            method: 'GET',
            url: '/exactmeasure',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setOptions(resposta.exactmeasure)
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.error('Requisição invalida')
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
            <option key={optionMeasure.uuid} value={optionMeasure.uuid}>{optionMeasure.name}</option>
        )
    }

    function openModal() {
        setTitleModal("Cadastrar Medida")
        setDescModal("")
        setQuantModal("")
        setMedModal("0")
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
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alert.info('Insira a quantidade')
        } else if (sel === "0") {
            alert.info('Selecione o tipo de medida')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'POST',
                url: '/simplemeasure',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "name": desc,
                    "typemeasure": sel,
                    "quantity": quantity
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    if (resposta.status === 201) {
                        alerts.success(resposta.message)
                        setOpen(false)
                        loadData()
                    }else {
                        alerts.info(resposta.message)
                    }
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alerts.error('Requisição invalida')
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
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alerts.info('Insira a quantidade')
        } else if (sel === "0") {
            alerts.info('Selecione o tipo de medida')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'PUT',
                url: '/simplemeasure',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "uuid": uuidSel,
                    "name": desc,
                    "typemeasure": sel,
                    "quantity": quantity
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    alerts.success(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setTitleModal("Cadastrar Medida")
                        setDescModal("")
                        setQuantModal("")
                        setMedModal("0")
                        setUuidSel("")
                    }
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alerts.error('Requisição invalida')
                    } else if (resposta.status === 401) {
                        alerts.error('Não autorizado')
                    } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                })
        }
    }

    function checkModalOpen() {
        if (titleModal === "Cadastrar Medida") {
            saveMeasure()
        } else {
            updateMeasure()
        }

    }

    const RenderCards = (item) => {
        function openEdit() {
            setUuidSel(item.uuid)
            setTitleModal("Editar Medida")
            setDescModal(item.name)
            setQuantModal(item.quantity)
            setMedModal(item.typemeasureid)
            setOpen(true)
        }

        const deleteMeasure = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                var resposta;
                // @ts-ignore
                api({
                    method: 'DELETE',
                    url: '/simplemeasure',
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
                            alerts.error('Medida sendo utilizada por Matéria Prima')
                        } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                    })
            }
        }

        return (<>
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p>{item.name}</p>
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                </div>
                <div className="bottom-card">
                    <p>{item.quantity} {item.typemeasure}</p>
                    <div className="btn-excluir" onClick={deleteMeasure}>Excluir <FiTrash2 /></div>
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
        backgroundColor: "#202020",
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

export default memo(CardMeasures);