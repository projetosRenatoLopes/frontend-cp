// @ts-nocheck
import './index.css'
import React, { useState } from "react";
import { AiOutlineSearch } from 'react-icons/ai'
import { AiOutlineCloseCircle } from 'react-icons/ai'


const InputSearch = ({ onChange }) => {
    const [iconClean, setIconClean] = useState(<></>)
    function verifyText() {
        const searchText = document.getElementById('search-item')['value']
        if (searchText !== "") {
            setIconClean(<AiOutlineCloseCircle className='icon-clean-serach' onClick={cleanText}></AiOutlineCloseCircle>)
        } else {
            setIconClean(<></>)
        }
        console.log('tests')
    }

    function cleanText() {
        document.getElementById('search-item')['value'] = ""        
        setIconClean(<></>)
        onChange()
    }

    return (
        <>
            <div className="input-search search-comp">
                <AiOutlineSearch></AiOutlineSearch>
                <input className='searchinput' id='search-item' placeholder="Pesquisar" onChangeCapture={() => verifyText()} onChange={onChange}></input>
                {iconClean}
            </div>

        </>
    )
};

export default InputSearch;