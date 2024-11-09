import React from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AppHeader } from "./cmps/AppHeader.jsx";

import { About } from "./pages/About.jsx";
import { BugDetails } from "./pages/BugDetails.jsx";
import { BugIndex } from "./pages/BugIndex.jsx";
import { Home } from "./pages/Home.jsx";
import { LoginSignup } from './cmps/LoginSignup.jsx';

import { Login } from './cmps/Login.jsx';
import { Signup } from './cmps/Signup.jsx';

export function App() {

    return (
        <Router>
            <section className="app main-layout">
                <AppHeader />

                <main>
                    <Routes>
                        {/* <Route path="/" element={<Navigate to="/bug" />} /> */}
                        <Route path="/" element={<Home />} />
                        <Route path="/about" element={<About />}/>
                 
                        <Route path="/bug/:bugId" element={<BugDetails />} />
                       
                        <Route path="/bug" element={<BugIndex />} />
                        {/* <Route path="admin" element={<AdminIndex />} /> */}
                        <Route path="login" element={<LoginSignup />}>
                        <Route index element={<Login />} />
                        <Route path="signup" element={<Signup />} />
                    </Route>


                    </Routes>
                </main>
            </section>
        </Router>
    )
} 