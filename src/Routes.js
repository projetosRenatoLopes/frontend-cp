// @ts-nocheck
import React from "react";
import { Routes, Route} from 'react-router-dom';

import Erro from "./pages/Erro";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login.js";
import User from "./pages/User.js";
import Home from "./pages/Home";
import CustomMeasure from './pages/CustomMeasure'
import Feedstock from './pages/Feedstock'
import Production from "./pages/Production";
import Others from "./pages/Others";
import Category from './pages/Category'
import Backup from './pages/Backup'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
    return (
        <Routes >    
            <Route exact path={'/'} element={<Login />} />
            <Route exact path={'/login'} element={<Login />} />
            <Route exact path={'/Home'} element={<Home />} />
            <Route exact path={'/custommeasure'} element={<CustomMeasure />} />
            <Route exact path={'/feedstock'} element={<Feedstock />} />
            <Route exact path={'/others'} element={<Others />} />
            <Route exact path={'/category'} element={<Category />} />
            <Route exact path={'/production'} element={<Production />} />            
            <Route exact path={'/user'} element={<User />} />
            <Route exact path={'/backup'} element={<Backup />} />
            <Route exact path={'/erro'} element={<Erro />} />            
            <Route exact path={'/:others'} element={<NotFound />} />
            <Route exact path={'/notfound'} element={<NotFound />} />
            <Route exact index element={<div><Login /></div>} />
        </Routes>
    );
}
