
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

    openMenu(params) {
        this.setState({ displayMenu: 'menu-show' })
    }

    closeMenu(params) {
        this.setState({ displayMenu: 'menu-ocult' })
    }

    componentDidMount() {
        if (this.state.pagePathName === '/home') {
            this.setState({ actualPage: 'Inicio' });
        } else if (this.state.pagePathName === '/custommeasure') {
            this.setState({ actualPage: "Medidas" });
        } else if (this.state.pagePathName === '/user') {
            this.setState({ actualPage: "Usuário" });
        } else if (this.state.pagePathName === '/feedstock') {
            this.setState({ actualPage: "Matéria Prima" });
        } else if (this.state.pagePathName === '/production') {
            this.setState({ actualPage: "Produção" });
        } else {
            this.setState({ actualPage: 'Inicio' })
        }

        tokenValidation()

        const username = localStorage.getItem('userName')
        if (username !== 'undefined' && username !== undefined) {
            console.log(username)
            this.setState({ user: username })
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
                    <Link to={`/user`}>
                        <div className='userBar'>
                            <p>{this.state.user}</p>
                        </div>
                    </Link>
                </div>
                <div className={`menu ${this.state.displayMenu}`}>
                    <div className='menuIcon' onClick={() => this.closeMenu()}><AiOutlineMenuFold /><p>{this.state.actualPage}</p></div>
                    <div className='itens-menu'>
                        <ItensMenu />
                        <div onClick={() => this.logout()}>Sair</div>
                    </div>
                </div>
                <div className={`back-menu ${this.state.displayMenu}`} onClick={() => this.closeMenu()}></div>
            </>
        )
    }
}