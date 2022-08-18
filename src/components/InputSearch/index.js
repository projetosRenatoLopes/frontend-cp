import './index.css'
import React from "react";
import { AiOutlineSearch } from 'react-icons/ai'



const InputSearch = ({ onChange }) => {

    return (
        <>
            <div className="input-search search-comp">
                <AiOutlineSearch></AiOutlineSearch>
                <input className='searchinput' id='search-item' placeholder="Pesquisar" onChange={onChange}></input>
            </div>

        </>
    )
};

export default InputSearch;