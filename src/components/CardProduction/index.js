// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import { useAlert } from "react-alert";
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';

import "./index.css"
import InputSearch from '../InputSearch'
import api from "../../services/api"
import formatNumPonto from "../../utils/formatNumPonto";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";
import replaceAccent from '../../utils/replaceAccent';
import markText from "../../utils/markText";
import BtnDelete from "../Btns/BtnDelete"

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
    const [gallerySaved, setGallerySaved] = useState("")

    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);

    const [titleModal, setTitleModal] = useState("Cadastrar Produção")
    const [descModal, setDescModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
    const [selectModal, setSelectModal] = useState("0")

    const [uuidSel, setUuidSel] = useState("")
    const [objSelected, setObjSelected] = useState({})

    const [feedstockList, setFeedstockList] = useState([])
    const [wpoList, setWPOList] = useState([])
    const [categoryList, setCategoryList] = useState([])

    const [screenView, setScreenView] = useState('cards')

    const [iconShow, setIconShow] = useState(<><IoIosArrowDown /></>)
    const [displayShow, setDisplayShow] = useState('Flex')
    const [iconShowWPO, setIconShowWPO] = useState(<><IoIosArrowDown /></>)
    const [displayShowWPO, setDisplayShowWPO] = useState('Flex')

    const [btnQttFS, setBtnQttFS] = useState(false)
    const [btnQttWPO, setBtnQttWPO] = useState(false)
    const [buttonSave, setButtonSave] = useState('save')
    const [buttonDel, setButtonDel] = useState('')

    const [textSearch, setTextSearch] = useState("")

    async function loadData() {
        const token = localStorage.getItem('token')

        var categoryListGet;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/category',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                categoryListGet = resp.data;
                setCategoryList(categoryListGet.category)
            }).catch(error => {
                alerts.error('Erro Interno')
            })

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
                setGallery(resposta.production)
                setGallerySaved(resposta.production)
                if (objSelected.hasOwnProperty("uuid")) {
                    resposta.production.forEach(prod => {
                        if (prod.uuid === objSelected.uuid) {
                            setObjSelected(prod)
                        }
                    })
                }

                //const searchText = document.getElementById('search-item')['value']
                if (textSearch !== "") {
                    var newList = [];
                    resposta.production.forEach(element => {
                        const stringElement = replaceAccent(element.name.toLowerCase())
                        const stringSearch = replaceAccent(textSearch.toLowerCase())
                        if (stringElement.includes(stringSearch)) {
                            newList.push(element)
                        }
                    });
                    setGallery(newList)
                }

            }).catch(error => {
                resposta = error;
                if (resposta.status === 404) {
                    alerts.error('Erro 404 - Requisição invalida')
                } else if (resposta.status === 401) {
                    alerts.error('Não autorizado')
                } else { alerts.error('Erro interno') }
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
                alerts.error('Erro Interno')
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
                alerts.error('Erro Interno')
            })


    }

    useEffect(() => {
        loadData()
    }, [])

    function openModal() {
        setTitleModal("Cadastrar Produção")
        setDescModal("")
        setPriceModal("")
        setSelectModal("")
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

    async function searchItem() {
        const searchText = document.getElementById('search-item')['value']
        setTextSearch(searchText)
        const listItens = gallerySaved;
        var newList = [];
        listItens.forEach(element => {
            const stringElement = replaceAccent(element.name.toLowerCase())
            const stringSearch = replaceAccent(searchText.toLowerCase())
            if (stringElement.includes(stringSearch)) {
                newList.push(element)
            }
        });
        if (searchText === "") {
            await setGallery(gallerySaved)
        } else {
            await setGallery(newList)
        }

        markText(searchText)
    }

    const saveProduction = () => {
        const desc = document.getElementById('desc')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        const categoryid = document.getElementById('sel-categ')['value']
        if (desc === "") {
            alert('Insira a descrição')
        } else if (price === "") {
            alert('Insira o preço')
        } else if (categoryid === "0") {
            alert('Selecione uma categoria')
        } else {
            setButtonSave('load')
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
                    "price": price,
                    "categoryid": categoryid
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        alerts.success(resposta.message)
                    } else {
                        alerts.info(resposta.message)
                    }
                    setButtonSave('save')
                }).catch(error => {
                    setButtonSave('save')
                    alerts.error('Erro Interno')
                })
        }
    }

    const updateProduction = () => {
        const desc = document.getElementById('desc')['value']
        const priceInput = document.getElementById('price')['value']
        const price = formatRealRev(priceInput)
        const categoryid = document.getElementById('sel-categ')['value']
        if (desc === "") {
            alert('Insira a descrição')
        } else if (price === "") {
            alert('Insira o preço')
        } else if (categoryid === "0") {
            alert('Selecione uma categoria')
        } else {
            setButtonSave('load')
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
                    "price": price,
                    "categoryid": categoryid
                }

            })
                .then(async resp => {
                    resposta = resp.data;
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setDescModal("")
                        setPriceModal("")
                        setSelectModal("")
                        setUuidSel("")
                        setTitleModal("Cadastar Produção")
                        alerts.success(resposta.message)
                    } else {
                        alerts.info(resposta.message)
                    }
                    setButtonSave('save')
                }).catch(error => {
                    setButtonSave('save')
                    console.log(error)
                    alerts.error('Erro Interno')
                    // if (resposta.status === 404) {
                    //     alerts.error(resposta.message)
                    // } else if (resposta.status === 401) {
                    //     alerts.error('Não autorizado')
                    // } else { alerts.error(`Erro ${resposta.status} - ${resposta.message}`) }
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


    const RenderCardsCateg = (item) => {
        var productionsListCateg = []
        gallery.forEach(prod => {
            if (prod.categoryid === item.uuid) {
                productionsListCateg.push(prod)
            }
        })

        const RenderCards = (item) => {
            function openEdit() {
                setTitleModal("Editar Produção")
                setUuidSel(item.uuid)
                setDescModal(item.name)
                setPriceModal(`R$ ${item.price.replace(/[.]/, ',')}`)
                setSelectModal(item.categoryid)
                setOpen(true)
            }

            function openListFsU() {
                setUuidSel(item.uuid)
                setObjSelected(item)
                setScreenView('item')
            }

            const deleteProduction = () => {
                const del = window.confirm(`Deseja excluir ${item.name}?`)
                if (del === true) {
                    setButtonDel(`${item.uuid}`)
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
                            if (resposta.status === 201) {
                                loadData()
                                alerts.success(resposta.message)
                            } else {
                                alerts.info(resposta.message)
                            }
                            setButtonDel('')
                        }).catch(error => {
                            alerts.error('Erro Interno')
                            setButtonDel('')
                        })
                }
            }


            return (
                <div key={item.uuid} className="card-prod">
                    <div id='top-cards' className="top-card">
                        <div id='title-card' className="title-card" onClick={() => openListFsU()}><strong>{item.name}</strong></div>
                    </div>
                    <div className="bottom-card">
                        <div className="bottom-card-left">
                            <p>Custo: {`R$ ${item.cost.toFixed(2).replace(/[.]/, ',')}`}</p>
                            <p>Venda: {`R$ ${item.price.replace(/[.]/, ',')}`}</p>
                        </div>
                        <div className="bottom-card-right">
                            <p>Lucro: {`R$ ${item.profit.toFixed(2).replace(/[.]/, ',')}`}</p>
                            <p>{item.percent.toFixed(2)}% </p>
                        </div>
                    </div>
                    <div className="area-btns">
                        <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                        <p className="bar-division"></p>
                        {/* <div className="btn-excluir" onClick={deleteProduction}>Excluir <FiTrash2 /></div> */}
                        <BtnDelete buttonShow={buttonDel} onClick={deleteProduction} uuid={item.uuid} />
                    </div>
                </div>
            )
        }

        if (productionsListCateg.length > 0) {
            return (
                <>
                    <div className="categ-Name">
                        <p><strong>{item.name}</strong></p>
                        {productionsListCateg.map(RenderCards)}
                    </div>
                </>
            )
        } else {
            return (<></>)
        }

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
            <div className="card-prod">
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
                    <div className="input-search input-search-load"></div>
                </div>
                <div className="indicator-quantity">
                    <p className="ind-qtd-load"></p>
                </div>
                <div className="categ-Name">
                    <p className="categ-title"><strong></strong></p>
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
                </div>
            </>)
        } else {

            const BtnSave = () => {
                const img = '/img/loading.gif'
                if (buttonSave === 'save') {
                    return (<button className="btn-co btn-l btn-g" onClick={() => verifyModal()}>Salvar</button>)
                } else {
                    return (<img className="btn-co btn-l btn-g" src={img} alt='loading' style={{ height: '36px', margin: '0 0 0 5px', padding:'0 16.68px 0 16.68px' }}></img>)
                }
            }

            return (
                <>
                    <div className="area-button">
                        <div className="btn-new" onClick={() => openModal()}><MdLibraryAdd /> Novo</div>
                        <InputSearch defaultValue={textSearch} onChange={() => searchItem()}></InputSearch>
                    </div>
                    <div className="indicator-quantity">
                        <p>{gallery.length} itens</p>
                    </div>
                    {categoryList.map(RenderCardsCateg)}
                    {/* {gallery.map(RenderCards)} */}
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
                                <input className="modal-input modal-measure-desc" id="desc" autoComplete="off" placeholder="Descrição" defaultValue={descModal}></input>
                                <input className="modal-input modal-measure-price" autoComplete="off" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de venda"></input>
                                <select className="modal-input modal-fu-feedstock" id="sel-categ" defaultValue={selectModal}>
                                    <option value="0" hidden >Selecione uma categoria...</option>
                                    {categoryList.map((options) => { return (<option key={options.uuid} value={options.uuid}>{options.name}</option>) })}
                                </select>
                            </Typography>
                            <BtnSave />
                            {/* <button className="btn-co btn-l btn-g" onClick={() => verifyModal()}>Salvar</button> */}
                        </Box>
                    </Modal >
                </>
            )
        }
    } else {
        const RenderListFsu = (item) => {

            const price = item.price.toFixed(2)

            function openEditFeedstock() {
                objSelected.feedstockused.forEach(fsug => {
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
                } else if (quantityEdit === "0.") {
                    alerts.info("Insira a quantidade corretamente")
                } else if (quantityEdit === "0" || quantityEdit <= 0) {
                    alerts.info("A quantidade não pode ser 0")
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
                            alerts.error('Erro Interno')
                        })
                }
            }

            return (
                <tbody key={item.uuid}>
                    <tr>
                        <td>{item.feedstock}</td>
                        <td>{item.quantity} {item.measurement}
                            <div id={`edit-${item.uuid}`} className="edit-geral" style={{ display: 'none' }}><input defaultValue={item.quantity} autoComplete="off" className="qtd-edit-feedstock" id={`qtd-${item.uuid}`} onChange={() => verifyNum(`qtd-${item.uuid}`)}></input><button className="btn-edit-feedstock" onClick={() => saveEditFeedstock()}><FiSave /></button></div>
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
                objSelected.wpoused.forEach(wpoug => {
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
                console.log(parseInt(quantityEdit).toFixed(2))
                if (quantityEdit === "") {
                    alerts.info("Insira a quantidade")
                } else if (quantityEdit === "0.") {
                    alerts.info("Insira a quantidade corretamente")
                } else if (quantityEdit === "0" || quantityEdit <= 0) {
                    alerts.info("A quantidade não pode ser 0")
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
                            alerts.error('Erro Interno')
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
                                if (resposta.status === 201) {
                                    loadData()
                                    alerts.success(resposta.message)
                                } else {
                                    alerts.info(resposta.message)
                                }
                            }).catch(error => {
                                alerts.error('Erro Interno')
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
                            <div id={`edit-${item.uuid}`} className="edit-geral" style={{ display: 'none' }}><input defaultValue={item.quantity} autoComplete="off" className="qtd-edit-feedstock" id={`qtd-${item.uuid}`} onChange={() => verifyNum(`qtd-${item.uuid}`)}></input><button className="btn-edit-feedstock" onClick={() => saveEditWPO()}><FiSave /></button></div>
                        </td>
                        <td>{`R$ ${price.replace(/[.]/, ',')}`}</td>
                        <td className="area-trash-item btn-el" onClick={() => openEditWPO()}><TiEdit /></td>
                        <td className="area-trash-item btn-rm" onClick={() => deleteWPOUS()}><FiTrash2 /></td>
                    </tr>
                </tbody>
            )
        }

        function addFeedstock() {
            if (btnQttFS === false) {

                const feedstockSel = document.getElementById("sel-feedstock")["value"]
                const quantity = document.getElementById("quantity")["value"]
                if (feedstockSel === "0") {
                    alerts.info("Selecione uma opção...")
                } else if (quantity === "") {
                    alerts.info("Insira a quantidade")
                } else if (quantity === "0.") {
                    alerts.info("Insira a quantidade corretamente")
                } else if (quantity === "0" || quantity <= 0) {
                    alerts.info("A quantidade não pode ser 0")
                } else {
                    setBtnQttFS(true)
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
                                setBtnQttFS(false)
                            } else {
                                alerts.info(resposta.message)
                                setBtnQttFS(false)
                            }
                        }).catch(error => {
                            setBtnQttFS(false)
                            alerts.error('Erro Interno')
                        })
                }
            }
        }

        function addWPO() {
            if (btnQttWPO === false) {
                const wpoSel = document.getElementById("sel-wpo")["value"]
                const quantity = document.getElementById("quantity-wpo")["value"]
                if (wpoSel === "0") {
                    alerts.info("Selecione uma opção...")
                } else if (quantity === "") {
                    alerts.info("Insira a quantidade")
                } else if (quantity === "0.") {
                    alerts.info("Insira a quantidade corretamente")
                } else if (quantity === "0" || quantity <= 0) {
                    alerts.info("A quantidade não pode ser 0")
                } else {
                    setBtnQttWPO(true)
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
                                setBtnQttWPO(false)
                            } else {
                                alerts.info(resposta.message)
                                setBtnQttWPO(false)
                            }
                        }).catch(error => {
                            setBtnQttWPO(false)
                            alerts.error('Erro Interno')
                        })
                }
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
                            if (resposta.status === 201) {
                                loadData()
                                alerts.success(resposta.message)
                            } else {
                                alerts.info(resposta.message)
                            }
                        }).catch(error => {
                            alerts.error('Erro Interno')
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

        var fsu = 0;
        objSelected.feedstockused.forEach((element) => {
            fsu += element.price;
        })
        var wpou = 0;
        objSelected.wpoused.forEach((element) => {
            wpou += element.price;
        })

        return (<>

            <h2>{objSelected.name}</h2>
            <div className="modal-button-production">
                <div className="btn-co-mini btn-c btn-gm" id="btn-back" onClick={() => setScreenView('cards')} ><BiArrowBack /> Voltar</div>
            </div>
            <div className="indicators">
                <div>
                    <p><strong>Venda:</strong> R$ {objSelected.price}</p>
                    <p><strong>Lucro:</strong> R$ {objSelected.profit.toFixed(2).replace(['.'], [','])}</p>
                </div>
                <div>
                    <p><strong>Custo:</strong> R$ {objSelected.cost.toFixed(2).replace(['.'], [','])}</p>
                    <p><strong>% Lucro:</strong> {objSelected.percent.toFixed(2)}</p>
                </div>
            </div>

            <div onClick={() => showList()} className="title-list"><p>Matéria Prima</p><div className="icon-showlist">{iconShow}</div></div>
            <div style={{ display: displayShow, flexDirection: 'column', width: '100%', maxWidth: '1000px', marginBottom: '1px solid #FFFFFF' }}>
                <div className="area-add-feedstockused">
                    <select className="modal-input modal-fu-feedstock" id="sel-feedstock">
                        <option value='0' hidden >Selecione uma opção...</option>
                        {feedstockList.map((optionFeedstock) => { return (<option key={optionFeedstock.uuid} value={optionFeedstock.uuid}>{optionFeedstock.name} - {optionFeedstock.quantity} {optionFeedstock.measurement}</option>) })}
                    </select>
                    <div className="modal-button-add">
                        <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity')} autoComplete="off" id="quantity" placeholder="Quantidade"></input>
                        <button className="btn-co-mini btn-lm btn-gm" onClick={() => addFeedstock()} ><MdAddBox className="icon-add" /></button>
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
                                    <td colSpan="2">Ações</td>
                                </tr>
                            </thead>
                            {objSelected.feedstockused.map(RenderListFsu)}
                        </table>
                    </div>
                </div>
                <p className="total-itens">Total: R$ {fsu.toFixed(2).replace(['.'], [','])}</p>
            </div>
            <div onClick={() => showListWpo()} className="title-list"><p>Outros Custos</p><div className="icon-showlist">{iconShowWPO}</div></div>
            <div style={{ display: displayShowWPO, flexDirection: 'column', width: '100%', maxWidth: '1000px' }}>
                <div className="area-add-feedstockused">
                    <select className="modal-input modal-fu-feedstock" id="sel-wpo">
                        <option value='0' hidden >Selecione uma opção...</option>
                        {wpoList.map((optionWPO) => { return (<option key={optionWPO.uuid} value={optionWPO.uuid}>{optionWPO.name} - {optionWPO.quantity}</option>) })}
                    </select>
                    <div className="modal-button-add">
                        <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity-wpo')} autoComplete="off" id="quantity-wpo" placeholder="Quantidade"></input>
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
                                    <td colSpan="2">Ações</td>
                                </tr>
                            </thead>
                            {objSelected.wpoused.map(RenderListWPOU)}
                        </table>
                    </div>
                </div>
                <p className="total-itens">Total: R$ {wpou.toFixed(2).replace(['.'], [','])}</p>
            </div>
        </>
        )
    }
}

export default memo(CardProduction);
