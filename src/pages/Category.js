import React from "react";
import CardCategory from "../components/CardCategory";
import HeaderBar from "../HeaderBar";


const Category = () => {
    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p className="title-page">Cadastro de Categorias</p>
                <CardCategory />
            </div>
        </>
    )
}

export default Category;