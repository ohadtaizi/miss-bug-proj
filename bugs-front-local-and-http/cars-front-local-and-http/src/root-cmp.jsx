import { useState } from 'react'
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

import { AppHeader } from "./cmps/AppHeader.jsx";

import { About } from "./pages/About.jsx";
import { BugDetails } from "./pages/BugDetails.jsx";
import { BugIndex } from "./pages/BugIndex.jsx";
import { Home } from "./pages/Home.jsx";

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
                    </Routes>
                </main>
            </section>
        </Router>
    )
} 