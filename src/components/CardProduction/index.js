// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import { useAlert } from "react-alert";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import "./index.css"
import api from "../../services/api"
import formatNumPonto from "../../utils/formatNumPonto";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";

import { AiTwotoneEdit } from 'react-icons/ai'
import { FiTrash2 } from 'react-icons/fi'
import { TiEdit } from 'react-icons/ti'
import { FiSave } from 'react-icons/fi'

const CardProduction = () => {
    const alerts = useAlert();
    const token = localStorage.getItem('token')
    const [gallery, setGallery] = useState([])
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [openFsU, setOpenFsU] = useState(false);
    const handleCloseFsU = () => setOpenFsU(false);
    const [titleModal, setTitleModal] = useState("Cadastrar Produção")
    const [descModal, setDescModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
    const [uuidSel, setUuidSel] = useState("")
    const [feedstockUsedGallery, setFsUG] = useState([])
    const [feedstockUsedTitle, setFsUT] = useState("")
    const [feedstockList, setFeedstockList] = useState([])
    const [screenView, setScreenView] = useState('cards')

    async function loadData() {
        const token = localStorage.getItem('token')
        var resposta;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/production',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setGallery(resposta.productions)
                if (uuidSel !== "") {
                    resposta.productions.forEach(prod => {
                        if (prod.uuid === uuidSel) {
                            setFsUG(prod.feedstockused)
                        }
                    })
                }
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.error('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
            })

        var feedstockListGet;
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
                feedstockListGet = resp.data;
                setFeedstockList(feedstockListGet.feedstock)
            }).catch(error => {
                resposta = error.toJSON();
                if (resposta.status === 404) {
                    alerts.erro('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
            })
    }

    useEffect(() => {
        loadData()
    }, [])

    function openModal() {
        setTitleModal("Cadastrar Produção")
        setDescModal("")
        setPriceModal("")
        setUuidSel("")
        setOpen(true)
    }

    // @ts-ignore
    const verifyNum = (el) => {
        // @ts-ignore
        const num = document.getElementById(`${el}`)['value']
        // @ts-ignore
        document.getElementById(`${el}`)['value'] = formatNumPonto(num)
    }

    const saveProduction = () => {
        const desc = document.getElementById('desc')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alert('Insira a descrição')
        } else if (price === "") {
            alert('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'POST',
                url: '/production',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "name": desc,
                    "price": price
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    alerts.success(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
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

    const updateProduction = () => {
        const desc = document.getElementById('desc')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        if (desc === "") {
            alert('Insira a descrição')
        } else if (price === "") {
            alert('Insira o preço')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'PUT',
                url: '/production',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "uuid": uuidSel,
                    "name": desc,
                    "price": price
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    alerts.success(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setDescModal("")
                        setPriceModal("")
                        setUuidSel("")
                        setTitleModal("Cadastar Produção")
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

    const verifyModal = () => {
        if (titleModal === "Editar Produção") {
            updateProduction()
        } else {
            saveProduction()
        }
    }

    const RenderCards = (item) => {
        function openEdit() {
            setTitleModal("Editar Produção")
            setUuidSel(item.uuid)
            setDescModal(item.name)
            setPriceModal(`R$ ${item.price.replace(/[.]/, ',')}`)
            setOpen(true)
        }

        function openListFsU() {
            setFsUG(item.feedstockused)
            setUuidSel(item.uuid)
            setFsUT(item.name)
            setOpenFsU(true)
            setScreenView('item')
        }

        const cost = item.cost.toFixed(2)
        const profit = item.price - cost
        var percent = 0;
        if (cost > 0) {
            percent = (profit * 100) / cost
        } else {
            percent = 100;
        }


        const deleteProduction = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                var resposta;
                // @ts-ignore
                api({
                    method: 'DELETE',
                    url: '/production',
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


        return (
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <div className="title-card" onClick={() => openListFsU()}><strong>{item.name}</strong></div>
                    <div className="area-btns">
                        <div className="btn-excluir" onClick={deleteProduction}>Excluir <FiTrash2 /></div>
                        <p>|</p>
                        <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                    </div>
                </div>
                <div className="bottom-card">
                    <div className="bottom-card-left">
                        <div>Custo: {`R$ ${cost.replace(/[.]/, ',')}`}</div>
                        <div>Venda: {`R$ ${item.price.replace(/[.]/, ',')}`}</div>
                    </div>
                    <div className="bottom-card-right">
                        <div>Lucro: {`R$ ${profit.toFixed(2).replace(/[.]/, ',')}`}</div>
                        <div>{percent.toFixed(2)}% </div>
                    </div>
                </div>
            </div>
        )
    }

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '80%',
        maxWidth: '500px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        backgroundColor: "#202020",
    };

    if (screenView === 'cards') {

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
                            <input className="modal-input modal-measure-desc" id="desc" placeholder="Descrição" defaultValue={descModal}></input>
                            <input className="modal-input modal-measure-price" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de custo"></input>
                        </Typography>
                        <button className="btn-co btn-l btn-g" onClick={() => verifyModal()}>Salvar</button>
                    </Box>
                </Modal >
            </>

        )
    } else {
        const renderListFsu = (item) => {
            const price = item.price.toFixed(2)


            function openEditFeedstock() {
                feedstockUsedGallery.forEach(fsug => {
                    if (fsug.uuid === item.uuid) {
                        const verifuDisplay = document.getElementById(`edit-${item.uuid}`).style.display
                        if (verifuDisplay === 'flex') {
                            document.getElementById(`edit-${item.uuid}`).style.display = 'none'
                        } else {
                            document.getElementById(`edit-${item.uuid}`).style.display = 'flex'
                        }
                    } else {
                        document.getElementById(`edit-${fsug.uuid}`).style.display = 'none'
                    }
                })
            }

            function saveEditFeedstock() {
                const quantityEdit = document.getElementById(`qtd-${item.uuid}`)['value']
                console.log(quantityEdit)
                if (quantityEdit === "") {
                    alerts.info("Insira a quantidade")
                } else {
                    var resposta;
                    // @ts-ignore
                    api({
                        method: 'PUT',
                        url: '/feedstockused',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        },
                        data: {
                            "uuid": item.uuid,
                            "quantity": quantityEdit,
                            "productionid": uuidSel
                        }
                    })
                        .then(async resp => {
                            resposta = resp.data;
                            if (resposta.status === 201) {
                                document.getElementById(`edit-${item.uuid}`).style.display = 'none'
                                alerts.success(resposta.message)
                                loadData()
                            } else if (resposta.status === 200) {
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

            return (
                <tbody key={item.uuid}>
                    <tr>
                        <td>{item.feedstock}</td>
                        <td>{item.quantity} {item.measurement}
                            <div id={`edit-${item.uuid}`} className="edit-geral" style={{ display: 'none' }}><input defaultValue={item.quantity} className="qtd-edit-feedstock" id={`qtd-${item.uuid}`}></input><button className="btn-edit-feedstock" onClick={() => saveEditFeedstock()}><FiSave /></button></div>
                        </td>
                        <td>{`R$ ${price.replace(/[.]/, ',')}`}</td>
                        <td className="area-trash-item" onClick={() => openEditFeedstock()}><TiEdit /></td>
                        <td className="area-trash-item" onClick={() => deleteFeedstock(item.uuid, item.feedstock)}><FiTrash2 /></td>
                    </tr>
                </tbody>
            )
        }

        const renderOptionsFeedstock = (optionFeedstock) => {
            return (<option key={optionFeedstock.uuid} value={optionFeedstock.uuid}>{optionFeedstock.name} - {optionFeedstock.quantity} {optionFeedstock.measurement}</option>)
        }

        function addFeedstock() {
            const feedstockSel = document.getElementById("sel-feedstock")["value"]
            const quantity = document.getElementById("quantity")["value"]
            if (feedstockSel === "0") {
                alerts.info("Selecione uma matéria prima")
            } else if (quantity === "") {
                alerts.info("Insira a quantidade")
            } else {

                var resposta;
                // @ts-ignore
                api({
                    method: 'POST',
                    url: '/feedstockused',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: {
                        "feedstockid": feedstockSel,
                        "quantity": quantity,
                        "productionid": uuidSel
                    }
                })
                    .then(async resp => {
                        resposta = resp.data;
                        if (resposta.status === 201) {
                            alerts.success(resposta.message)
                            loadData()
                        } else if (resposta.status === 200) {
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

        function deleteFeedstock(uuidDel, nameDel) {
            const confirmDelete = window.confirm(`Remover ${nameDel}?`)
            if (confirmDelete === true) {
                try {
                    var resposta;
                    // @ts-ignore
                    api({
                        method: 'DELETE',
                        url: '/feedstockused',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: token
                        },
                        data: {
                            "uuid": uuidDel
                        }
                    })
                        .then(async resp => {
                            resposta = resp.data;
                            alerts.success(resposta.message)
                            if (resposta.status === 201) {
                                loadData()
                            }
                        }).catch(error => {
                            resposta = error.toJSON();
                            if (resposta.status === 404) {
                                alerts.error('Erro 404 - Requisição invalida')
                            } else if (resposta.status === 401) {
                                alerts.error('Não autorizado')
                            } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
                        })
                } catch (error) {
                    alerts.error("Erro ao tentar exluir")
                }
            }
        }
        return (<>
            <div className="modal-button">
                <button className="btn-co-mini btn-rm btn-gm" onClick={() => setScreenView('cards')} >Fechar</button>
            </div>
            <h2>{feedstockUsedTitle}</h2>
            <div className="area-add-feedstockused">
                <select className="modal-input modal-fu-feedstock" id="sel-feedstock">
                    <option value='0' hidden >Materia Prima</option>
                    {feedstockList.map(renderOptionsFeedstock)}
                </select>
                <div className="modal-button-add">
                    <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity')} id="quantity" placeholder="Quantidade"></input>
                    <button className="btn-co-mini btn-lm btn-gm" onClick={() => addFeedstock()} >Adicionar</button>
                </div>
            </div>
            <div className="modal-inputs">
                <div className="table-feedstockused">
                    <table>
                        <thead>
                            <tr>
                                <td>Máteria Prima</td>
                                <td>Quantidade</td>
                                <td>Custo</td>
                                <td></td>
                                <td></td>
                            </tr>
                        </thead>
                        {feedstockUsedGallery.map(renderListFsu)}
                    </table>
                </div>
            </div>
        </>)
    }
}

export default memo(CardProduction);