// @ts-nocheck

import React from 'react';
import { Link } from 'react-router-dom';
import './index.css'
import { AiOutlineMenuFold, AiOutlineMenuUnfold } from 'react-icons/ai'
import ItensMenu from './ItensMenu';
import tokenValidation from '../services/tokenValidation';

export default class HeaderBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayMenu: 'menu-ocult',
            actualPage: 'Inicio',
            pagePathName: window.location.pathname,
            user: '',
        }
    }
    username = localStorage.getItem('userName');

    openMenu(params) {
        this.setState({ displayMenu: 'menu-show' })
    }

    closeMenu(params) {
        this.setState({ displayMenu: 'menu-ocult' })
    }

    async componentDidMount() {
        if (this.state.pagePathName === '/home') {
            this.setState({ actualPage: 'Inicio' });
            document.getElementById('Inicio').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/custommeasure') {
            this.setState({ actualPage: "Medidas" });
            document.getElementById('Medidas').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/user') {
            this.setState({ actualPage: "Usuário" });
            document.getElementById('Usuário').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/feedstock') {
            this.setState({ actualPage: "Matéria Prima" });
            document.getElementById('Matéria Prima').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/production') {
            this.setState({ actualPage: "Produção" });
            document.getElementById('Produção').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/others') {
            this.setState({ actualPage: "Outros Custos" });
            document.getElementById('Outros Custos').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/backup') {
            this.setState({ actualPage: "Backup" });
            document.getElementById('Backup').style.borderBottom = '3px solid #FFF'
        } else if (this.state.pagePathName === '/category') {
            this.setState({ actualPage: "Categorias" });
            document.getElementById('Categorias').style.borderBottom = '3px solid #FFF'
        } else {
            this.setState({ actualPage: 'Inicio' })
        }
        tokenValidation()
        if (this.username !== 'undefined' && this.username !== undefined) {
            this.setState({ user: this.username })
        } else {
            this.setState({ user: 'Carregando Usuário...' })
        }

        setInterval(() => {
            const username = localStorage.getItem('userName')
            if (username !== undefined) {
                this.setState({ user: username })
            } else {
                this.setState({ user: 'Carregando Usuário...' })
            }
        }, 5000);
    }

    logout() {
        localStorage.removeItem('token')
        localStorage.removeItem('userName')
        window.location.href = '/login'
    }

    render() {
        return (
            <>
                <div className="headerBar">
                    <div className='menuBar' onClick={() => this.openMenu()}><AiOutlineMenuUnfold /><p>{this.state.actualPage}</p></div>
                    <div className='itens-menu-headbar'>
                        <ItensMenu />
                        <Link to={`/user`} className="user-menu">
                        <div className='userBar' id="Usuário">
                            <p>{this.state.user}</p>
                        </div>
                    </Link>
                        <div className='itens-menu-div' key='sair' onClick={() => this.logout()}>Sair</div>
                    </div>
                    <Link to={`/user`} className="user-menu-rigth">
                        <div className='userBar'>
                            <p>{this.state.user}</p>
                        </div>
                    </Link>
                </div>
                <div className={`menu ${this.state.displayMenu}`}>
                    <div className='menuIcon' onClick={() => this.closeMenu()}><AiOutlineMenuFold /><p>{this.state.actualPage}</p></div>
                    <div className='itens-menu'>
                        <ItensMenu />
                        <div className='itens-menu-div' key='sair' onClick={() => this.logout()}>Sair</div>
                    </div>
                        <p className='app-version'>v 1.0.0</p>
                </div>
                <div className={`back-menu ${this.state.displayMenu}`} onClick={() => this.closeMenu()}></div>                
            </>
        )
    }
}