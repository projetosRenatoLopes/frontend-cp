import React from "react";
import CardDash from "../components/CardDash";
import HeaderBar from "../HeaderBar";

const Home = () => {

    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p className="title-page">Dashboard</p>
                <p className='app-version-head'>v 1.0.0</p>
                <CardDash></CardDash>
            </div>
        </>
    )
}

export default Home;