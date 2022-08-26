// @ts-nocheck
import React, { useEffect, useState, memo } from "react";

import api from "../../services/api"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputSearch from '../InputSearch'

import formatNum from "../../utils/formatNum";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";
import replaceAccent from '../../utils/replaceAccent';
import markText from "../../utils/markText";
import BtnDelete from "../Btns/BtnDelete"

import { AiTwotoneEdit } from 'react-icons/ai'
import { useAlert } from "react-alert";
import { FiTrash2 } from 'react-icons/fi'
import { MdLibraryAdd } from 'react-icons/md'

const CardOthers = () => {
    const alerts = useAlert();
    const [gallery, setGallery] = useState("")
    const [gallerySaved, setGallerySaved] = useState("")
    const [open, setOpen] = useState(false);
    const handleClose = () => setOpen(false);
    const token = localStorage.getItem('token')
    const [titleModal, setTitleModal] = useState("Cadastrar Outros Custos")
    const [descModal, setDescModal] = useState("")
    const [quantModal, setQuantModal] = useState("")
    const [priceModal, setPriceModal] = useState("")
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
            url: '/wpo',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                setGallery(resposta.wpo)
                setGallerySaved(resposta.wpo)

                const searchText = document.getElementById('search-item')['value']
                if (searchText !== "") {
                    var newList = [];
                    resposta.wpo.forEach(element => {
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

    function openModal() {
        setTitleModal("Cadastrar Outros Custos")
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
            setButtonSave('load')
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
                    setButtonSave('save')
                }).catch(error => {
                    setButtonSave('save')
                    alerts.error('Erro Interno')
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
            setButtonSave('load')
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
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setTitleModal("Cadastrar Outros Custos")
                        setDescModal("")
                        setQuantModal("")
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
        if (titleModal === "Cadastrar Outros Custos") {
            saveWPO()
        } else {
            updateWPO()
        }
    }

    const RenderCards = (item) => {

        function openEdit() {
            setUuidSel(item.uuid)
            setTitleModal("Editar Outros Custos")
            setDescModal(item.name)
            setQuantModal(item.quantity)
            setPriceModal(`R$ ${item.price.replace(/[.]/, ',')}`)
            setOpen(true)
        }

        const deleteWPO = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                setButtonDel(`${item.uuid}`)
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
                    .then(resp => {
                        resposta = resp.data;
                        if (resposta.status === 201) {
                            loadData()
                            alerts.success(resposta.message)
                        } else {
                            alerts.info(resposta.message)
                        }
                        setButtonDel('')
                    }).catch(resp => {
                        console.log(resp.toJSON())
                        alerts.error('Erro Interno')
                        setButtonDel('')
                    })
            }
        }

        const qtdPrice = `${item.quantity} - R$ ${item.price.replace(/[.]/, ',')}`
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
                    <BtnDelete buttonShow={buttonDel} onClick={deleteWPO} uuid={item.uuid} />
                    {/* <div className="btn-excluir" onClick={deleteWPO}>Excluir <FiTrash2 /></div> */}
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
                return (<img className="btn-co btn-l btn-g" src={img} alt='loading' style={{ height: '36px', margin: '0 0 0 5px', padding: '0 16.68px 0 16.68px' }}></img>)
            }
        }

        return (
            <>
                <div className="area-button">
                    <div className="btn-new" onClick={() => openModal()}><MdLibraryAdd /> Novo</div>
                    <InputSearch onChange={() => searchItem()} defaultValue={textSearch}></InputSearch>
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
                            <input className="modal-input modal-measure-desc" id="desc" autoComplete="off" placeholder="Descrição" defaultValue={descModal}></input>
                            <input className="modal-input modal-measure-quantity" autoComplete="off" onChange={() => verifyNum('quantity')} id="quantity" defaultValue={quantModal} placeholder="Quantidade"></input>
                            <input className="modal-input modal-measure-price" autoComplete="off" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Valor por quantidade"></input>
                        </Typography>
                        <BtnSave />
                        {/* <button className="btn-co btn-l btn-g" onClick={checkModalOpen}>Salvar</button> */}
                    </Box>
                </Modal >
            </>
        )
    }
}

export default memo(CardOthers);
