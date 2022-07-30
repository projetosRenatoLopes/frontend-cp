import React from "react"
import { useLocation } from "react-router-dom"
import HeaderBar from "../HeaderBar"

const NotFound = () => {
    const company = useLocation()
    if (company.pathname.split('/')[1] === '' || company.pathname.split('/')[1] === 'notfound') {
        const imgErro = '/img/404.png'
        return (
            <>

                <HeaderBar />
                <div className='bodyPage'>                    
                    <p>404 - Página não Encontrada!</p>
                    <img src={imgErro} className="logo-top" alt="img-logo" style={{ 'maxWidth': '30rem', 'minWidth': '16rem' }}></img>
                </div>                
                
            </>
        )
    } else {
        window.location.href = '/notfound'
    }



}

export default NotFound;
