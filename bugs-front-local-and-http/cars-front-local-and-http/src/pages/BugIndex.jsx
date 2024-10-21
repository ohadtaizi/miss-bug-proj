import { useEffect, useState,useCallback } from 'react';

import { bugService } from "../services/bug.service.remote.js"
import { showErrorMsg, showSuccessMsg } from "../services/event-bus.service.js"

import { BugFilter } from "../cmps/BugFilter.jsx"
import { BugList } from "../cmps/BugList.jsx"
import { utilService } from '../services/util.service.js';

export function BugIndex() {

    const [bugs, setBugs] = useState([])
    const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())
const debouncefilterByBug=
useCallback(utilService.debounce(onSetFilterBy,1000),[])

    useEffect(() => {
        loadBugs()
        fetchData()
    }, [filterBy])


    async function loadBugs() {
        const bugs = await bugService.query()
        setBugs(bugs)
    }


    async function fetchData() {
        try {
            const bugs = await bugService.query(filterBy)
            setBugs(bugs)
        } catch (err) {
            console.log('err:', err)
        }
    }

    async function onRemoveBug(bugId) {
        try {
            await bugService.remove(bugId)
            setBugs(prevBugs => prevBugs.filter(bug => bug._id !== bugId))
            showSuccessMsg(`Bug Removed! ${bugId}`)
        } catch (err) {
            console.log('err:', err)
            showErrorMsg('Problem Removing ' + bugId)
        }
    }

    function onSetFilterBy(filterBy) {
        setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
    }

    async function onAddBug() {
        const bug = {
            title: prompt('Bug title?'),
            severity: +prompt('Bug severity?'),
            description: prompt('Bug description?')
        }
        try {
            const savedBug = await bugService.save(bug)
            console.log('Added Bug', savedBug)
            setBugs(prevBugs => [...prevBugs, savedBug])
            showSuccessMsg('Bug added')
        } catch (err) {
            console.log('Error from onAddBug ->', err)
            showErrorMsg('Cannot add bug')
        }
    }


    async function onEditBug(bug) {
        const severity = +prompt('New severity?')
        const description = prompt('Bug description?')
        const bugToSave = { ...bug, severity, description }
        try {


            const savedBug = await bugService.save(bugToSave)
            console.log('Updated Bug:', savedBug)
            setBugs(prevBugs => prevBugs.map((currBug) =>
                currBug._id === savedBug._id ? savedBug : currBug
            ))
            showSuccessMsg('Bug updated')
        } catch (err) {
            console.log('Error from onEditBug ->', err)
            showErrorMsg('Cannot update bug')
        }
    }
    function onDownloadPdf() {
        const doc = new jsPDF();
    
    
        const jsonString = JSON.stringify(bugs, null, 2); 
    
    
        doc.text('JSON Bugs Data:', 10, 10); 
        doc.text(jsonString, 10, 20);  
    
    
        doc.save('json-data.pdf');
      }
    

    if (!bugs) return <div>Loading...</div>
    return (
        <section className="bug-index">
            <h3>Bugs App</h3>
            <main>
                <button onClick={onAddBug}>Add Bug ⛐</button>
                <button onClick={onDownloadPdf}>Download PDF</button>
                <BugFilter filterBy={filterBy} onSetFilterBy={debouncefilterByBug} />
                <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
            </main>

        </section>
    )
}