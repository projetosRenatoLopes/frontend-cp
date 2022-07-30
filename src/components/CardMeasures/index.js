// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import "./index.css"
import api from "../../services/api"
import { AiTwotoneEdit } from 'react-icons/ai'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import formatNum from "../../utils/formatNum";


const CardMeasures = () => {
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
                    alert('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alert('Não autorizado')
                } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
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
                    alert('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alert('Não autorizado')
                } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
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
            alert('Insira a descrição')
        } else if (quantity === "") {
            alert('Insira a quantidade')
        } else if (sel === "0") {
            alert('Selecione o tipo de medida')
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
                    alert(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                    }
                }).catch(error => {
                    resposta = error.toJSON();
                    if (resposta.status === 404) {
                        alert('Erro 404 - Requisição invalida')
                    } else if (resposta.status === 401) {
                        alert('Não autorizado')
                    } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
                })
        }
    }

    const updateMeasure = () => {
        const desc = document.getElementById('desc')['value']
        const quantity = document.getElementById('quantity')['value']
        const sel = document.getElementById('sel')['value']
        if (desc === "") {
            alert('Insira a descrição')
        } else if (quantity === "") {
            alert('Insira a quantidade')
        } else if (sel === "0") {
            alert('Selecione o tipo de medida')
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
                    alert(resposta.message)
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
                        alert('Erro 404 - Requisição invalida')
                    } else if (resposta.status === 401) {
                        alert('Não autorizado')
                    } else { alert(`Erro ${resposta.status} - ${resposta.message}`) }
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

        return (<>
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p>{item.name}</p>
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                </div>
                <div className="bottom-card">
                    <p>{item.quantity} {item.typemeasure}</p>
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