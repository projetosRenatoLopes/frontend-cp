import React from "react";
import CardFeedstock from "../components/CardFeedstock";
import HeaderBar from "../HeaderBar";


const Feedstock = () => {
    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p className="title-page">Cadastro de Matéria Prima</p>
                <CardFeedstock />
            </div>
        </>
    )
}

export default Feedstock;