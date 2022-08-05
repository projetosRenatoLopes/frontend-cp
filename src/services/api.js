import axios from "axios";
import { useState } from 'react'

const token = localStorage.getItem('token')

const api = axios.create({
    baseURL: "https://api-custodeproducao.onrender.com",
    //baseURL: "http://192.168.0.40:8680/",
});

export default api;
