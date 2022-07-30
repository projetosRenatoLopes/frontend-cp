// @ts-nocheck
import React, { useEffect, useState, memo } from "react";
import "./index.css"
import api from "../../services/api"
import { AiTwotoneEdit } from 'react-icons/ai'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import formatNumPonto from "../../utils/formatNumPonto";
import formatReal from "../../utils/formatReal";
import formatRealRev from "../../utils/formatRealRev";
import { FiTrash2 } from 'react-icons/fi'
import { useAlert } from "react-alert";

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
    const [measureSelected, setMeasureSelected] = useState("Selecione uma Materia prima...")

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

    const verifyModal = () =>{
        if(titleModal === "Editar Produção"){
            console.log("1")
            updateProduction()
        } else {
            console.log("2")
            saveProduction()
        }
        console.log("Fora")
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
            setOpenFsU(true)
            setFsUT(item.name)
        }

        const cost = item.cost.toFixed(2)                
        const profit = item.price - cost

        return (<>
            <div key={item.uuid} className="card">
                <div className="top-card">
                    <div className="title-card" onClick={() => openListFsU()}><strong>{item.name}</strong></div>
                    <div className="btn-editar" onClick={openEdit}>Editar <AiTwotoneEdit /></div>
                </div>
                <div className="bottom-card">
                    <div>
                        <div style={{ color: 'red' }}>Custo: {`R$ ${cost.replace(/[.]/, ',')}`}</div>
                        <div style={{ color: 'blue' }}>Venda: {`R$ ${item.price.replace(/[.]/, ',')}`}</div>
                    </div>
                    <div style={{ color: 'green' }}>Lucro: {`R$ ${profit.toFixed(2).replace(/[.]/, ',')}`}</div>
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
        width: '80%',
        maxWidth: '450px',
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
    };


    const ModalFeedstockUsed = () => {

        const renderListFsu = (item) => {
            const price = item.price.toFixed(2)
            return (<>
                <tbody>
                    <tr>
                        <td>{item.feedstock}</td>
                        <td>{item.quantity} {item.measurement}</td>
                        <td>{`R$ ${price.replace(/[.]/, ',')}`}</td>
                        <td className="area-trash-item" onClick={() => alerts.error(`Excluindo ${item.feedstock} `)}><FiTrash2 /></td>
                    </tr>
                </tbody>
            </>)
        }

        const renderOptionsFeedstock = (optionFeedstock) => {

            return (
                <>
                    <option key={optionFeedstock.uuid} value={optionFeedstock.uuid}>{optionFeedstock.name} - {optionFeedstock.quantity} {optionFeedstock.measurement}</option>
                </>
            )
        }

        const renderOptionsMeasures = (optionMeasure) => {
            return (<>
                <option key={optionMeasure.uuid} value={optionMeasure.uuid}>{optionMeasure.name} - {optionMeasure.quantity} {optionMeasure.typemeasure}</option>
            </>)
        }

        function changeMeasures() {
            const idFeedstock = document.getElementById('sel-feedstock')['value']
            feedstockList.forEach(item => {
                if (item.uuid === idFeedstock) {
                    setMeasureSelected(item.measurement)
                }
            })
        }

        return (<>
            <Modal
                open={openFsU}
                onClose={handleCloseFsU}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        <strong>{feedstockUsedTitle}</strong>
                    </Typography>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        <div className="area-add-feedstockused">
                            <select className="modal-input modal-fu-feedstock" id="sel-feedstock">
                                <option value='0' hidden >Materia Prima</option>
                                {feedstockList.map(renderOptionsFeedstock)}
                            </select>
                            <div className="modal-button-add">
                                <input className="modal-input modal-fu-quantity" onChange={() => verifyNum('quantity')} id="quantity" placeholder="Quantidade"></input>
                                <button className="btn-co-mini btn-lm btn-gm" >Adicionar</button>
                            </div>
                        </div>
                        <div className="modal-inputs">
                            <div className="table-feedstockused">
                                <thead>
                                    <tr>
                                        <td>Máteria Prima</td>
                                        <td>Quantidade</td>
                                        <td>Custo</td>
                                        <td></td>
                                    </tr>
                                </thead>
                                {feedstockUsedGallery.map(renderListFsu)}
                            </div>
                        </div>
                        <div className="modal-button">
                            <button className="btn-co-mini btn-rm btn-gm" onClick={() => setOpenFsU(false)} >Fechar</button>
                        </div>
                    </Typography>
                </Box>
            </Modal >
        </>)
    }


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
                            <input className="modal-input modal-measure-price" onChange={() => formatReal('price')} id="price" defaultValue={priceModal} placeholder="Preço de custo"></input>
                        </div>
                        <div className="modal-button">
                            <button className="btn-co btn-l btn-g" onClick={() => verifyModal()}>Salvar</button>
                        </div>
                    </Typography>
                </Box>
            </Modal >
            <ModalFeedstockUsed feedstockUsed={feedstockUsedGallery} />
        </>

    )
}

export default memo(CardProduction);