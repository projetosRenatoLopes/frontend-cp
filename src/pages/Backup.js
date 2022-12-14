// @ts-nocheck
import React, { useState } from "react";
import api from "../services/api"
import HeaderBar from "../HeaderBar";
import { useAlert } from "react-alert";


const Backup = () => {
    const alerts = useAlert();
    const [btn, setBnt] = useState(<button className="btn-co btn-l btn-g" onClick={() => backup()}>Baixar dados</button>)
    const [btnSelFile, setBtnSelFile] = useState('sel')
    const [fileNameText, setFileNameText] = useState("file.name")
    const [bkpRestore, setBkpRestore] = useState()
    const [bkpTextTemp, setBkpTextTemp] = useState([]);

    const token = localStorage.getItem('token')

    async function backup() {
        const img = '/img/loading.gif'
        setBnt(<img src={img} alt='loading' style={{ width: '60PX', height: '60px' }}></img>)
        const token = localStorage.getItem('token')
        var resposta;
        // @ts-ignore
        await api({
            method: 'GET',
            url: '/backup',
            headers: {
                'Content-Type': 'application/json',
                Authorization: token
            }
        })
            .then(async resp => {
                resposta = resp.data;
                download('backup-data.bkpcp', JSON.stringify(resposta.rows))
            }).catch(error => {
                // @ts-ignore
                alert('erro ao baixar dados...')
            })
        setBnt(<button className="btn-co btn-l btn-g" onClick={() => backup()}>Baixar dados</button>)
    }

    function verifyFile(event) {


        var pathFile = document.getElementById("file-bkp")['value'];
        var fileName = pathFile;
        var idxDot = fileName.lastIndexOf(".") + 1;
        var extFile = fileName.substr(idxDot, fileName.length).toLowerCase();
        if (extFile === "bkpcp") {

            let reader = new FileReader();
            let file = event.target.files[0];
            reader.readAsText(file);
            reader.onloadend = () => {
                setBkpTextTemp(JSON.parse(`${reader.result}`))
            };

            setFileNameText(file.name)
            setBtnSelFile('selected')
        } else {
            document.getElementById("file-bkp")['value'] = ""
            alerts.error("Arquivo de backup inv??lido!");
        }
    }

    function cancelBkp() {
        setBtnSelFile('sel')
        setBkpRestore()
    }

    function loadFile() {
        console.log(bkpTextTemp)
        setBkpRestore(bkpTextTemp)
        setBtnSelFile('')
    }

    function download(filename, textInput) {
        var element = document.createElement('a');
        element.setAttribute('href', 'data:text/plain;charset=utf-8, ' + encodeURIComponent(textInput));
        element.setAttribute('download', filename);
        document.body.appendChild(element);
        element.click();
    }

    function TablesRestore() {
        if (bkpRestore !== undefined && bkpRestore !== 'undefined') {

            const ExacMeasureList = () => {
                if (bkpRestore.hasOwnProperty("exactmeasure") && bkpRestore.exactmeasure.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Medidas Sistema</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.exactmeasure.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const SimpleMeasureList = () => {
                if (bkpRestore.hasOwnProperty("simplemeasure") && bkpRestore.simplemeasure.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Medidas</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.simplemeasure.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const FeedstockList = () => {
                if (bkpRestore.hasOwnProperty("feedstock") && bkpRestore.feedstock.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Mat??ria Prima</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.feedstock.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const FeedstockUsedList = () => {
                if (bkpRestore.hasOwnProperty("feedstockused") && bkpRestore.feedstockused.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.production}</td><td>{item.feedstock}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="3">Mat??ria Prima Utilizada</td></tr>
                                    <tr><td>Produ????o</td><td>M??teria Prima</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.feedstockused.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const WPOList = () => {
                if (bkpRestore.hasOwnProperty("wpo") && bkpRestore.wpo.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Outros Custos</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.wpo.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const WPOUsedList = () => {
                if (bkpRestore.hasOwnProperty("wpoused") && bkpRestore.wpoused.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.production}</td><td>{item.wpo}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="3">Outros Custos Utilizados</td></tr>
                                    <tr><td>Produ????o</td><td>Custo</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.wpoused.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const ProductionList = () => {
                if (bkpRestore.hasOwnProperty("production") && bkpRestore.production.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Produ????o</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.production.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const UsersList = () => {
                if (bkpRestore.hasOwnProperty("users") && bkpRestore.users.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Usu??rios</td></tr>
                                    <tr><td>Nome</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.users.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }

            const CategoryList = () => {
                if (bkpRestore.hasOwnProperty("category") && bkpRestore.category.length !== 0) {

                    const renderList = (item) => {
                        return (<>
                            <tbody key={item.uuid}>
                                <tr><td>{item.name}</td><td id={`status-${item.uuid}`}>aguardando</td></tr>
                            </tbody>
                        </>)
                    }

                    return (
                        <div className="table-bkp">
                            <table>
                                <thead>
                                    <tr><td colSpan="2">Categorias</td></tr>
                                    <tr><td>Descri????o</td><td>status</td></tr>
                                </thead>
                                {bkpRestore.category.map(renderList)}
                            </table>
                        </div>
                    )
                } else {
                    return (<></>)
                }
            }


            return (
                <div className="area-list-restore" >
                    <button className="btn-co btn-l btn-g" onClick={() => restoreBackup()} >Iniciar restaura????o</button>                   
                    <CategoryList />
                    <SimpleMeasureList />
                    <FeedstockList />
                    <FeedstockUsedList />
                    <WPOList />
                    <WPOUsedList />
                    <ProductionList />                    
                </div>
            )

        } else {
            return (<></>)
        }
    }

    async function restoreBackup() {
        var allItens = []

        await bkpRestore.category.forEach(element => {
            allItens.push({ "table": "category", "reg": element })
        });

        await bkpRestore.simplemeasure.forEach(element => {
            allItens.push({ "table": "simplemeasure", "reg": element })
        });

        await bkpRestore.feedstock.forEach(element => {
            allItens.push({ "table": "feedstock", "reg": element })
        });

        await bkpRestore.feedstockused.forEach(element => {
            allItens.push({ "table": "feedstockused", "reg": element })
        });

        await bkpRestore.wpo.forEach(element => {
            allItens.push({ "table": "wpo", "reg": element })
        });

        await bkpRestore.wpoused.forEach(element => {
            allItens.push({ "table": "wpoused", "reg": element })
        });

        await bkpRestore.production.forEach(element => {
            allItens.push({ "table": "production", "reg": element })
        });

        await bkpRestore.users.forEach(element => {
            allItens.push({ "table": "users", "reg": element })
        });       

        sendItens(allItens)

    }

    function sendItens(allItens) {
        allItens.forEach((element, i) => {
            setTimeout(() => {
                const elementDOM = document.getElementById(`status-${element.reg.uuid}`)
                if (elementDOM !== null) {
                    elementDOM.innerText = 'Iniciando...'
                }
                api({
                    method: 'POST',
                    url: '/backup',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: token
                    },
                    data: {
                        "table": element.table,
                        "reg": element.reg
                    }
                })
                    .then(resp => {
                        if (elementDOM !== null) {
                            elementDOM.innerText = resp.data.status
                        }
                    }).catch(error => {
                        if (elementDOM !== null) {
                            elementDOM.innerText = 'Erro Interno'
                        }
                    })
            }, i * 2000);
        });
    }

    const BtnSelectFile = () => {
        if (btnSelFile === 'sel') {
            return (
                <>
                    <input type='file' id='file-bkp' name='bkpfile' accept=".bkpcp" onChange={(e) => verifyFile(e)} />
                </>
            )
        } else if (btnSelFile === 'selected') {
            return (
                <>
                    <p>{fileNameText}</p>
                    <button className="btn-co btn-l btn-g" onClick={() => loadFile()}>Carregar arquivo</button>
                </>
            )
        } else {
            return (
                <>
                    <p>{fileNameText}</p>
                    <button className="btn-co btn-r btn-g" onClick={() => cancelBkp()}>Cancelar</button>
                </>
            )
        }
    }

    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <div className="backup">
                    <div className="area-buttom-bkp">
                        <p>Backup</p>
                        {btn}
                    </div>
                    <div className="area-buttom-restore">
                        <p>Restaurar</p>
                        <BtnSelectFile />
                        <TablesRestore />
                    </div>
                </div>
            </div>
        </>
    )

}

export default Backup;