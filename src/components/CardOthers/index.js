// @ts-nocheck
import React, { useEffect, useState, memo } from "react";

import api from "../../services/api"
import "./index.css"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import formatNum from "../../utils/formatNum";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";

import { AiTwotoneEdit } from 'react-icons/ai'
import { useAlert } from "react-alert";
import { FiTrash2 } from 'react-icons/fi'
import { MdLibraryAdd } from 'react-icons/md'

const CardOthers = () => {
    const alerts = useAlert();
    const [gallery, setGallery] = useState("")
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const token = localStorage.getItem('token')
    const [titleModal, setTitleModal] = useState("Cadastrar Outros")
    const [descModal, setDescModal] = useState("")
    const [quantModal, setQuantModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
    const [uuidSel, setUuidSel] = useState("")



    async function loadData() {
        const token = localStorage.getItem('token')
        var resposta;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/wpo',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setGallery(resposta.wpo)
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

    function openModal() {
        setTitleModal("Cadastrar Outros")
        setDescModal("")
        setQuantModal("")
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

    const saveWPO = () => {
        const desc = document.getElementById('desc')['value']
        const quantity = document.getElementById('quantity')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alerts.info('Insira a quantidade')
        } else if (price === "") {
            alerts.info('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'POST',
                url: '/wpo',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "name": desc,
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

    const updateWPO = () => {
        const desc = document.getElementById('desc')['value']
        const quantity = document.getElementById('quantity')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else if (quantity === "") {
            alerts.info('Insira a quantidade')
        } else if (price === "") {
            alerts.info('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'PUT',
                url: '/wpo',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "uuid": uuidSel,
                    "name": desc,
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
                        setTitleModal("Cadastrar Outros")
                        setDescModal("")
                        setQuantModal("")
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
        if (titleModal === "Cadastrar Outros") {
            saveWPO()
        } else {
            updateWPO()
        }
    }

    const RenderCards = (item) => {
        function openEdit() {
            setUuidSel(item.uuid)
            setTitleModal("Editar Outros")
            setDescModal(item.name)
            setQuantModal(item.quantity)
            setPriceModal(`R$ ${item.price.replace(/[.]/, ',')}`)
            setOpen(true)
        }

        const deleteWPO = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                var resposta;
                // @ts-ignore
                api({
                    method: 'DELETE',
                    url: '/wpo',
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
                            alerts.error('Item sendo utilizado por Produção')
                        } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                    })
            }
        }

        const qtdPrice = `${item.quantity} - R$ ${item.price.replace(/[.]/, ',')}`
        return (
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p>{item.name}</p>
                </div>
                <div className="bottom-card">
                    <p>{qtdPrice}</p>
                </div>
                <div className="area-btns">
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                    <p className="bar-division"></p>
                    <div className="btn-excluir" onClick={deleteWPO}>Excluir <FiTrash2 /></div>
                </div>
            </div>
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



    const RenderCardsLoad = () => {

        return (
            <div className="card">
                <div className="top-card">
                    <p className="title-load"></p>
                </div>
                <div className="bottom-card">
                    <p className="qtdtype-load"> </p>
                </div>
                <div className="area-btns">
                    <div className="btn-editar-load" ></div>
                    <p className="bar-division-load"></p>
                    <div className="btn-excluir-load" id="btn-del" ></div>
                </div>
            </div>
        )
    }

    if (gallery === "") {
        return (<>
            <div className="area-button">
                <div className="btn-new-load" ></div>
            </div>
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad />
            <RenderCardsLoad /> 
        </>)
    } else {

        return (
            <>
                <div className="area-button">
                    {/* <button className="btn-co btn-l btn-g" onClick={() => openModal()}>Adicionar</button> */}
                    <div className="btn-new" onClick={() => openModal()}><MdLibraryAdd /> Novo</div>
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
                            <input className="modal-input modal-measure-desc" id="desc" placeholder="Descrição" defaultValue={descModal}></input>
                            <input className="modal-input modal-measure-quantity" onChange={() => verifyNum('quantity')} id="quantity" defaultValue={quantModal} placeholder="Quantidade"></input>
                            <input className="modal-input modal-measure-price" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Valor por quantidade"></input>
                        </Typography>
                        <button className="btn-co btn-l btn-g" onClick={checkModalOpen}>Salvar</button>
                    </Box>
                </Modal >
            </>
        )
    }
}

export default memo(CardOthers);