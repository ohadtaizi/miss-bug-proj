'use strict'

async function onGetBugs() {
    const elBugs = document.querySelector('pre');
    try {
        const res = await fetch('http://localhost:3031/api/bug');
        if (!res.ok) throw new Error('Failed to fetch bugs');
        const bugs = await res.json();
        elBugs.innerText = JSON.stringify(bugs, null, 2);
    } catch (err) {
        elBugs.innerText = `Error: ${err.message}`;
    }
}