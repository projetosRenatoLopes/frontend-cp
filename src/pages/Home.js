import React from "react";
import CardDash from "../components/CardDash";
import HeaderBar from "../HeaderBar";

const Home = () => {

    return (
        <>
            <HeaderBar />
            <div className='bodyPage'>
                <p>Dashboard</p>
                <CardDash></CardDash>
            </div>
        </>
    )
}

export default Home;