// @ts-nocheck
import './index.css'
import React from "react";
import { AiOutlineSearch } from 'react-icons/ai'
import { AiOutlineCloseCircle } from 'react-icons/ai'


const InputSearch = ({ onChange, defaultValue }) => {

    function cleanText() {
        document.getElementById('search-item')['value'] = ""
        onChange()
    }

    const IconShow = () => {
        if (defaultValue === "") {
            return (<></>)
        } else {
            return (<AiOutlineCloseCircle className='icon-clean-serach' onClick={cleanText}></AiOutlineCloseCircle>)
        }
    }

    return (
        <>
            <div className="input-search search-comp">
                <div className='svg-div'>
                    <AiOutlineSearch></AiOutlineSearch>
                </div>
                <div className='group-search'>
                    <input className='searchinput' defaultValue={defaultValue} id='search-item' placeholder="Pesquisar" onChange={onChange}></input>
                    <div className='svg-div'>
                        <IconShow></IconShow>
                    </div>
                </div>
            </div>

        </>
    )
};

export default InputSearch;