export function BugPreview({ bug }) {

    // function getImgUrl(vendor) {
    //     return new URL(`../assets/img/${vendor}.png`, import.meta.url).href
    // }

    return (
        <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>Severity: <span>{bug.severity}</span></p>
    </article>

    )
}
