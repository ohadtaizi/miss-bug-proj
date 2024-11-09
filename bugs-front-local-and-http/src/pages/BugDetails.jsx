import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate, useParams } from "react-router"

import { bugService } from "../services/bug/bug.service.remote"

export function BugDetails() {

    const [bug, setBug] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [params.bugId])

    async function loadBug() {
        try {
            const bug = await bugService.getById(params.bugId)
            setBug(bug)
        } catch (err) {
            console.log('err:', err)
            navigate('/bug')
        }
    }

    function onBack() {
        navigate('/bug')
    }

    if (!bug) return <div>Loading...</div>
    return (
        <section className="bug-details">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <h4>{bug.description}</h4>
        <h6>{bug.createdAt}</h6>
        <p>Severity: <span>{bug.severity}</span></p>

        <Link to="/bug">Back to List</Link>

        </section>
    )
}