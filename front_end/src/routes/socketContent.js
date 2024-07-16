import React, { useState, createContext, useRef, useEffect } from 'react'
import { io } from 'socket.io-client'
import Peer from 'simple-peer'

const SocketContext = createContext();
const socket = io('http://localhost:8000')

const ContextProvider = ({children}) => {
    const answerCall = ()=>{

    }
}