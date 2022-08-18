import React from "react"
import { memo, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Link } from "react-router-dom"

const GalerryItens = (props) => {
    const menus = [
        {
            id: '100', desc: 'Inicio', router: '/home', subs: []
        },
        {
            id: '200', desc: 'Cadastros', router: '', subs: [
                { id: '201', desc: 'Medidas', router: '/custommeasure' },
                { id: '202', desc: 'Matéria Prima', router: '/feedstock' },
                { id: '203', desc: 'Outros Custos', router: '/others' }
            ]
        },
        {
            id: '300', desc: 'Produção', router: '/production', subs: []
        },
        {
            id: '400', desc: 'Configurações', router: '', subs: [
                { id: '401', desc: 'Backup', router: '/backup' }
            ]
        },
    ]
    const [gallery] = useState(menus)

    const RenderCards = (gallery) => {
        const [subMenus] = useState(gallery.subs)
        const [displayShow, setDisplayShow] = useState('none')
        const [iconsShow, setIconShow] = useState(<><IoIosArrowUp key={`iconUp1-${gallery.id}`} /></>)

        if (gallery.subs.length === 0) {
            return (
                <Link className="itens-menu-div" id={gallery.desc} to={`${gallery.router}`} key={(gallery.id).toString()}>
                    <div>{gallery.desc}</div>
                </Link>
            )
        } else {
            const renderSubMenus = (subMenus) => {

                return (
                    <Link to={`${subMenus.router}`} key={`${subMenus.id}`} id={subMenus.desc}>
                        <div className="itens-menu-div subs-menus" style={{ display: `${displayShow}`, paddingLeft: '25px', width: '205px', height: '35px'}}>{subMenus.desc}</div>
                        <div className="itens-menu-div item-menu-child" >{subMenus.desc}</div>
                    </Link>
                )
            }

            function showSubs() {
                if (displayShow === 'none') {
                    setDisplayShow('flex')
                    setIconShow(<><IoIosArrowDown /></>)
                } else {
                    setDisplayShow('none')
                    setIconShow(<><IoIosArrowUp /></>)
                }
            }

            return (
                <div key={gallery.id} className="subs">
                    <div onClick={() => showSubs()} style={{ justifyContent: 'space-between' }} className="itens-menu-div item-menu-mother">
                        <p>{gallery.desc}</p>
                        <p style={{ paddingRight: '5px' }}>{iconsShow}</p>
                    </div>
                    {subMenus.map(renderSubMenus)}
                </div>
            )
        }
    }

    return (
        <>
            {gallery.map(RenderCards)}
        </>
    )
}

export default memo(GalerryItens);