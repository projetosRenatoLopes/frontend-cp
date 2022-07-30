// @ts-nocheck
import React from "react";
import CardMeasures from "../components/CardMeasures";
import HeaderBar from "../HeaderBar";


const CustomMeasure = () => {

    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p>Cadastro de Medidas</p>
                <CardMeasures />
            </div>
        </>
    )
}

export default CustomMeasure;