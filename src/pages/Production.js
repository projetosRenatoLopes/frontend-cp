import React from "react";
import CardProduction from "../components/CardProduction";
import HeaderBar from "../HeaderBar";


const Production = () => {
    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p>Produção</p>
                <CardProduction />
            </div>
        </>
    )
}

export default Production;