// @ts-nocheck
import React, { useEffect, useState, memo } from "react";

import api from "../../services/api"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputSearch from '../InputSearch'
import BtnDelete from "../Btns/BtnDelete"

import formatNum from "../../utils/formatNum";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";
import replaceAccent from '../../utils/replaceAccent';

import { AiTwotoneEdit } from 'react-icons/ai'
import { useAlert } from "react-alert";
import { FiTrash2 } from 'react-icons/fi'
import { MdLibraryAdd } from 'react-icons/md'
import markText from "../../utils/markText";

const CardFeedstock = () => {
    const alerts = useAlert();
    const [gallery, setGallery] = useState("")
    const [gallerySaved, setGallerySaved] = useState("")
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
    const [textSearch, setTextSearch] = useState("")
    const [buttonSave, setButtonSave] = useState('save')
    const [buttonDel, setButtonDel] = useState('')

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
                alerts.error('Erro Interno')
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
                setGallerySaved(resposta.feedstock)

                const searchText = document.getElementById('search-item')['value']
                if (searchText !== "") {
                    var newList = [];
                    resposta.feedstock.forEach(element => {
                        const stringElement = replaceAccent(element.name.toLowerCase())
                        const stringSearch = replaceAccent(searchText.toLowerCase())
                        if (stringElement.includes(stringSearch)) {
                            newList.push(element)
                        }
                    });
                    setGallery(newList)
                }



            }).catch(error => {
                alerts.error('Erro Interno')
            })


    }

    useEffect(() => {
        loadData()
    }, [])


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
            setButtonSave('load')
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
                    setButtonSave('save')
                }).catch(error => {
                    setButtonSave('save')
                    alerts.error('Erro Interno')
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
            setButtonSave('load')
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
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setTitleModal("Cadastrar Matéria Prima")
                        setDescModal("")
                        setQuantModal("")
                        setMedModal("0")
                        setPriceModal("")
                        setUuidSel("")
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
                setButtonDel(`${item.uuid}`)
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
                        if(resposta.status === 201){
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

        const qtdPrice = `${item.quantity} ${(item.measurement).toLowerCase()} - R$ ${item.price.replace(/[.]/, ',')}`
        return (
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p className="title-card">{item.name}</p>
                </div>
                <div className="bottom-card">
                    <p>{qtdPrice}</p>
                </div>
                <div className="area-btns">
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                    <p className="bar-division"></p>
                    <BtnDelete buttonShow={buttonDel} onClick={deleteFeedstock} uuid={item.uuid} />
                    {/* <div className="btn-excluir" onClick={deleteFeedstock}>Excluir <FiTrash2 /></div> */}
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
                <div className="input-search input-search-load"></div>
            </div>
            <div className="indicator-quantity">
                <p className="ind-qtd-load"></p>
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

        const BtnSave = () => {
            const img = '/img/loading.gif'
            if (buttonSave === 'save') {
                return (<button className="btn-co btn-l btn-g" onClick={checkModalOpen}>Salvar</button>)
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
                    <p >{gallery.length} itens.</p>
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
                            <input className="modal-input modal-measure-desc" autoComplete="off" id="desc" placeholder="Descrição" defaultValue={descModal}></input>
                            <input className="modal-input modal-measure-quantity" autoComplete="off" onChange={() => verifyNum('quantity')} id="quantity" defaultValue={quantModal} placeholder="Quantidade"></input>
                            <select className="modal-input modal-measure-typemeasure" id="sel" defaultValue={medModal}>
                                <option value='0' hidden >Tipo de medida</option>
                                {optionsMeasure.map(RenderOptions)}
                            </select>
                            <input className="modal-input modal-measure-price" autoComplete="off" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de custo"></input>
                            <BtnSave />
                        </Typography>
                    </Box>
                </Modal >
            </>
        )
    }
}

export default memo(CardFeedstock);
