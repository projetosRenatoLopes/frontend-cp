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
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { MdAddBox } from 'react-icons/md'
import { BiArrowBack } from 'react-icons/bi'
import { MdLibraryAdd } from 'react-icons/md'

const CardProduction = () => {
    const alerts = useAlert();
    const token = localStorage.getItem('token')
    const [gallery, setGallery] = useState("")
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const [openFsU, setOpenFsU] = useState(false);
    const handleCloseFsU = () => setOpenFsU(false);
    const [titleModal, setTitleModal] = useState("Cadastrar Produção")
    const [descModal, setDescModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
    const [uuidSel, setUuidSel] = useState("")
    const [feedstockUsedGallery, setFsUG] = useState([])
    const [wpoUsedGallery, setWPOUG] = useState([])
    const [feedstockUsedTitle, setFsUT] = useState("")
    const [feedstockList, setFeedstockList] = useState([])
    const [wpoList, setWPOList] = useState([])
    const [screenView, setScreenView] = useState('cards')
    const [iconShow, setIconShow] = useState(<><IoIosArrowDown /></>)
    const [displayShow, setDisplayShow] = useState('Flex')
    const [iconShowWPO, setIconShowWPO] = useState(<><IoIosArrowDown /></>)
    const [displayShowWPO, setDisplayShowWPO] = useState('Flex')
    const [btnQttFS, setBtnQttFS] = useState(false)
    const [btnQttWPO, setBtnQttWPO] = useState(false)

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
                            setWPOUG(prod.wpoused)
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

        var wpoListGet;
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
                wpoListGet = resp.data;
                setWPOList(wpoListGet.wpo)
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
            setWPOUG(item.wpoused)
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
                </div>
                <div className="bottom-card">
                    <div className="bottom-card-left">
                        <p>Custo: {`R$ ${cost.replace(/[.]/, ',')}`}</p>
                        <p>Venda: {`R$ ${item.price.replace(/[.]/, ',')}`}</p>
                    </div>
                    <div className="bottom-card-right">
                        <p>Lucro: {`R$ ${profit.toFixed(2).replace(/[.]/, ',')}`}</p>
                        <p>{percent.toFixed(2)}% </p>
                    </div>
                </div>
                <div className="area-btns">
                    <div className="btn-excluir" onClick={deleteProduction}>Excluir <FiTrash2 /></div>
                    <p className="bar-division"></p>
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
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

    const RenderCardsLoad = () => {

        return (
            <div className="card">
                <div className="top-card">
                    <div className="title-load"><strong></strong></div>
                </div>
                <div className="bottom-card">
                    <div className="bottom-card-left">
                        <p className="item-prod-load"></p>
                        <p className="item-prod-load"></p>
                    </div>
                    <div className="bottom-card-right">
                        <p className="item-prod-load"></p>
                        <p className="item-prod-load"></p>
                    </div>
                </div>
                <div className="area-btns">
                    <div className="btn-excluir-load" ></div>
                    <p className="bar-division-load"></p>
                    <div className="btn-editar-load" ></div>
                </div>
            </div>
        )
    }

    if (screenView === 'cards') {
        if (gallery === "") {
            return (<>
                <div className="area-button">
                    <div className="btn-new-load" ></div>
                </div>
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
                                <input className="modal-input modal-measure-price" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de custo"></input>
                            </Typography>
                            <button className="btn-co btn-l btn-g" onClick={() => verifyModal()}>Salvar</button>
                        </Box>
                    </Modal >
                </>
            )
        }
    } else {
        const RenderListFsu = (item) => {
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
                            <div id={`edit-${item.uuid}`} className="edit-geral" style={{ display: 'none' }}><input defaultValue={item.quantity} className="qtd-edit-feedstock" id={`qtd-${item.uuid}`} onChange={() => verifyNum(`qtd-${item.uuid}`)}></input><button className="btn-edit-feedstock" onClick={() => saveEditFeedstock()}><FiSave /></button></div>
                        </td>
                        <td>{`R$ ${price.replace(/[.]/, ',')}`}</td>
                        <td className="area-trash-item btn-el" onClick={() => openEditFeedstock()}><TiEdit /></td>
                        <td className="area-trash-item btn-rm" onClick={() => deleteFeedstock(item.uuid, item.feedstock)}><FiTrash2 /></td>
                    </tr>
                </tbody>
            )
        }

        const RenderListWPOU = (item) => {
            const price = item.price.toFixed(2)

            function openEditWPO() {
                wpoUsedGallery.forEach(wpoug => {
                    if (wpoug.uuid === item.uuid) {
                        const verifuDisplay = document.getElementById(`edit-${item.uuid}`).style.display
                        if (verifuDisplay === 'flex') {
                            document.getElementById(`edit-${item.uuid}`).style.display = 'none'
                        } else {
                            document.getElementById(`edit-${item.uuid}`).style.display = 'flex'
                        }
                    } else {
                        document.getElementById(`edit-${wpoug.uuid}`).style.display = 'none'
                    }
                })
            }

            function saveEditWPO() {
                const quantityEdit = document.getElementById(`qtd-${item.uuid}`)['value']
                if (quantityEdit === "") {
                    alerts.info("Insira a quantidade")
                } else {
                    var resposta;
                    // @ts-ignore
                    api({
                        method: 'PUT',
                        url: '/wpoused',
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

            function deleteWPOUS() {
                const confirmDelete = window.confirm(`Remover ${item.wpo}?`)
                if (confirmDelete === true) {
                    try {
                        var resposta;
                        // @ts-ignore
                        api({
                            method: 'DELETE',
                            url: '/wpoused',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: token
                            },
                            data: {
                                "uuid": item.uuid
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
                        alerts.error("Erro ao tentar excluir")
                    }
                }
            }

            return (
                <tbody key={item.uuid}>
                    <tr>
                        <td>{item.wpo}</td>
                        <td>{item.quantity}
                            <div id={`edit-${item.uuid}`} className="edit-geral" style={{ display: 'none' }}><input defaultValue={item.quantity} className="qtd-edit-feedstock" id={`qtd-${item.uuid}`} onChange={() => verifyNum(`qtd-${item.uuid}`)}></input><button className="btn-edit-feedstock" onClick={() => saveEditWPO()}><FiSave /></button></div>
                        </td>
                        <td>{`R$ ${price.replace(/[.]/, ',')}`}</td>
                        <td className="area-trash-item btn-el" onClick={() => openEditWPO()}><TiEdit /></td>
                        <td className="area-trash-item btn-rm" onClick={() => deleteWPOUS()}><FiTrash2 /></td>
                    </tr>
                </tbody>
            )
        }

        const renderOptionsFeedstock = (optionFeedstock) => {
            return (<option key={optionFeedstock.uuid} value={optionFeedstock.uuid}>{optionFeedstock.name} - {optionFeedstock.quantity} {optionFeedstock.measurement}</option>)
        }

        const renderOptionsWPO = (optionWPO) => {
            return (<option key={optionWPO.uuid} value={optionWPO.uuid}>{optionWPO.name} - {optionWPO.quantity}</option>)
        }

        function addFeedstock() {
            setBtnQttFS(true)
            const feedstockSel = document.getElementById("sel-feedstock")["value"]
            const quantity = document.getElementById("quantity")["value"]
            if (feedstockSel === "0") {
                alerts.info("Selecione uma opção...")
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
                            document.getElementById("sel-feedstock")["value"] = "0"
                            document.getElementById("quantity")["value"] = ""
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
            setBtnQttFS(false)
        }

        function addWPO() {
            setBtnQttWPO(true)
            const wpoSel = document.getElementById("sel-wpo")["value"]
            const quantity = document.getElementById("quantity-wpo")["value"]
            if (wpoSel === "0") {
                alerts.info("Selecione uma opção...")
            } else if (quantity === "") {
                alerts.info("Insira a quantidade")
            } else {

                var resposta;
                // @ts-ignore
                api({
                    method: 'POST',
                    url: '/wpoused',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: {
                        "wpoid": wpoSel,
                        "quantity": quantity,
                        "productionid": uuidSel
                    }
                })
                    .then(async resp => {
                        resposta = resp.data;
                        if (resposta.status === 201) {
                            document.getElementById("sel-wpo")["value"] = "0"
                            document.getElementById("quantity-wpo")["value"] = ""
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
            setBtnQttWPO(false)
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
                    alerts.error("Erro ao tentar excluir")
                }
            }
        }

        function deleteWPOU(uuidDel, nameDel) {
            const confirmDelete = window.confirm(`Remover ${nameDel}?`)
            if (confirmDelete === true) {
                try {
                    var resposta;
                    // @ts-ignore
                    api({
                        method: 'DELETE',
                        url: '/wpoused',
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
                    alerts.error("Erro ao tentar excluir")
                }
            }
        }

        function showList() {
            if (displayShow === 'none') {
                setDisplayShow('flex')
                setIconShow(<><IoIosArrowDown /></>)
            } else {
                setDisplayShow('none')
                setIconShow(<><IoIosArrowUp /></>)
            }
        }
        function showListWpo() {
            if (displayShowWPO === 'none') {
                setDisplayShowWPO('flex')
                setIconShowWPO(<><IoIosArrowDown /></>)
            } else {
                setDisplayShowWPO('none')
                setIconShowWPO(<><IoIosArrowUp /></>)
            }
        }


        return (<>

            <h2>{feedstockUsedTitle}</h2>
            <div className="modal-button-production">
                <button className="btn-co-mini btn-rm btn-gm" onClick={() => setScreenView('cards')} ><BiArrowBack /> Voltar</button>
            </div>

            <div onClick={() => showList()} className="title-list"><p>Matéria Prima</p><div className="icon-showlist">{iconShow}</div></div>
            <div style={{ display: displayShow, flexDirection: 'column', width: '100%', maxWidth: '650px', marginBottom: '1px solid #FFFFFF' }}>
                <div className="area-add-feedstockused">
                    <select className="modal-input modal-fu-feedstock" id="sel-feedstock">
                        <option value='0' hidden >Selecione uma opção...</option>
                        {feedstockList.map(renderOptionsFeedstock)}
                    </select>
                    <div className="modal-button-add">
                        <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity')} id="quantity" placeholder="Quantidade"></input>
                        <button className="btn-co-mini btn-lm btn-gm" onClick={() => addFeedstock()} disabled={btnQttFS}><MdAddBox className="icon-add" /></button>
                    </div>
                </div>
                <div className="modal-inputs">
                    <div className="table-feedstockused">
                        <table>
                            <thead>
                                <tr>
                                    <td>Máteria Prima</td>
                                    <td>Qtd.</td>
                                    <td>Custo</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            {feedstockUsedGallery.map(RenderListFsu)}
                        </table>
                    </div>
                </div>
            </div>
            <div onClick={() => showListWpo()} className="title-list"><p>Outros Custos</p><div className="icon-showlist">{iconShowWPO}</div></div>
            <div style={{ display: displayShowWPO, flexDirection: 'column', width: '100%', maxWidth: '650px' }}>
                <div className="area-add-feedstockused">
                    <select className="modal-input modal-fu-feedstock" id="sel-wpo">
                        <option value='0' hidden >Selecione uma opção...</option>
                        {wpoList.map(renderOptionsWPO)}
                    </select>
                    <div className="modal-button-add">
                        <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity-wpo')} id="quantity-wpo" placeholder="Quantidade"></input>
                        <button className="btn-co-mini btn-lm btn-gm" onClick={() => addWPO()} disabled={btnQttWPO} ><MdAddBox /></button>
                    </div>
                </div>
                <div className="modal-inputs">
                    <div className="table-feedstockused">
                        <table>
                            <thead>
                                <tr>
                                    <td>Descrição</td>
                                    <td>Qtd.</td>
                                    <td>Custo</td>
                                    <td></td>
                                    <td></td>
                                </tr>
                            </thead>
                            {wpoUsedGallery.map(RenderListWPOU)}
                        </table>
                    </div>
                </div>
            </div>
        </>
        )
    }
}

export default memo(CardProduction);