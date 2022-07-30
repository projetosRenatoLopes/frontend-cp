import React from "react"
import { memo, useState } from 'react'
import { IoIosArrowDown, IoIosArrowUp } from 'react-icons/io'
import { Link } from "react-router-dom"

const GalerryItens = (props) => {
    const menus = [
        {
            id: '1', desc: 'Inicio', router: '/home', subs: []
        },
        {
            id: '2', desc: 'Cadastros', router: '', subs: [
                { id: '2a', desc: 'Medidas', router: '/custommeasure' },
                { id: '2b', desc: 'Matéria Prima', router: '/feedstock' },
            ]
        },
        {
            id: '3', desc: 'Produção', router: '/production', subs: []
        },
    ]
    const [gallery, setGallery] = useState(menus)

    const RenderCards = (gallery) => {
        const [subMenus, setSubMenus] = useState(gallery.subs)
        const [displayShow, setDisplayShow] = useState('none')
        const [iconsShow, setIconShow] = useState(<><IoIosArrowUp /></>)

        if (gallery.subs.length === 0) {
            return (
                <Link to={`${gallery.router}`}><div key={gallery.id}>{gallery.desc}</div></Link>
            )
        } else {
            const renderSubMenus = (subMenus) => {
                return (<>
                    <Link to={`${subMenus.router}`}><div key={subMenus.id} style={{ display: `${displayShow}`, paddingLeft: '25px', width: '205px', height: '35px', backgroundColor: '#0f7195' }}>{subMenus.desc}</div></Link>
                </>)
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
                <>
                    <div onClick={() => showSubs()} style={{ justifyContent: 'space-between' }} ><p>{gallery.desc}</p><p style={{ paddingRight: '5px' }}>{iconsShow}</p></div>
                    {subMenus.map(renderSubMenus)}
                </>
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