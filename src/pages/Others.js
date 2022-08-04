import React from "react";
import CardOthers from "../components/CardOthers";
import HeaderBar from "../HeaderBar";


const Others = () => {
    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p>Cadastro de Mão de Obra, Embalagens e Outros</p>
                <CardOthers />
            </div>
        </>
    )
}

export default Others;