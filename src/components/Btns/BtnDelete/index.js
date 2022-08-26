import React from "react"
import { FiTrash2 } from 'react-icons/fi'

const BtnDelete = (props) => {
    const buttonShow = props.buttonShow;
    const onClick = props.onClick;
    const id = props.uuid;
    const img = '/img/loading.gif'

    if (id === buttonShow) {
        return (<img className="btn-co btn-l btn-g" src={img} alt='loading' style={{ height: '30px', margin: '0 0 0 5px', padding: '0 24.5px 0 24.5px' }}></img>)
    } else {
        return (<div className="btn-excluir" onClick={onClick}>Excluir <FiTrash2 /></div>)
    }
}

export default BtnDelete;