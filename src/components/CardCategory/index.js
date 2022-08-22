// @ts-nocheck
import React, { useEffect, useState, memo } from "react";

import api from "../../services/api"

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import InputSearch from '../InputSearch'

import replaceAccent from '../../utils/replaceAccent';
import markText from "../../utils/markText";

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
    const [titleModal, setTitleModal] = useState("Cadastrar Categoria")
    const [descModal, setDescModal] = useState("")
    const [uuidSel, setUuidSel] = useState("")
    const [textSearch, setTextSearch] = useState("")



    async function loadData() {
        const token = localStorage.getItem('token')
        var resposta;
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
                resposta = resp.data;
                setGallery(resposta.category)
                setGallerySaved(resposta.category)
                const searchText = document.getElementById('search-item')['value']
                if (searchText !== "") {
                    var newList = [];
                    resposta.category.forEach(element => {
                        const stringElement = replaceAccent(element.name.toLowerCase())
                        const stringSearch = replaceAccent(searchText.toLowerCase())
                        if (stringElement.includes(stringSearch)) {
                            newList.push(element)
                        }
                    });
                    setGallery(newList)
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
        setTitleModal("Cadastrar Categoria")
        setDescModal("")
        setUuidSel("")
        setOpen(true)
    }

    const saveCategory = () => {
        const desc = document.getElementById('desc')['value']
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'POST',
                url: '/category',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "name": desc
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

    const updateCategory = () => {
        const desc = document.getElementById('desc')['value']
        if (desc === "") {
            alerts.info('Insira a descrição')
        } else {
            var resposta;
            // @ts-ignore
            api({
                method: 'PUT',
                url: '/category',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: token
                },
                data: {
                    "uuid": uuidSel,
                    "name": desc
                }
            })
                .then(async resp => {
                    resposta = resp.data;
                    alerts.success(resposta.message)
                    if (resposta.status === 201) {
                        setOpen(false)
                        loadData()
                        setTitleModal("Cadastrar Categoria")
                        setDescModal("")
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
        if (titleModal === "Cadastrar Categoria") {
            saveCategory()
        } else {
            updateCategory()
        }
    }

    const RenderCards = (item) => {
        function openEdit() {
            setUuidSel(item.uuid)
            setTitleModal("Editar Categoria")
            setDescModal(item.name)
            setOpen(true)
        }

        const deleteCategory = () => {
            const del = window.confirm(`Deseja excluir ${item.name}?`)
            if (del === true) {
                var resposta;
                // @ts-ignore
                api({
                    method: 'DELETE',
                    url: '/category',
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

        return (
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <p className="title-card">{item.name}</p>
                </div>
                <div className="bottom-card">
                </div>
                <div className="area-btns">
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                    <p className="bar-division"></p>
                    <div className="btn-excluir" onClick={deleteCategory}>Excluir <FiTrash2 /></div>
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
                            <input className="modal-input modal-measure-desc" id="desc" autocomplete="off" placeholder="Descrição" defaultValue={descModal}></input>
                        </Typography>
                        <button className="btn-co btn-l btn-g" onClick={checkModalOpen}>Salvar</button>
                    </Box>
                </Modal >
            </>
        )
    }
}

export default memo(CardOthers);