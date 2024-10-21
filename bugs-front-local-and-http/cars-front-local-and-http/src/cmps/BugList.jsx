import { Link } from "react-router-dom";
import { BugPreview } from "./BugPreview.jsx";



export function BugList({ bugs, onRemoveBug ,onEditBug}) {

    return (
        <ul className="bug-list">
            {bugs.map(bug =>
                <li key={bug._id}>
                    <BugPreview bug={bug} />
                    <section>
                        <button onClick={() => onRemoveBug(bug._id)}>Remove Bug</button>
                        <button><Link to={`/bug/${bug._id}`}>Details</Link></button>
                        <button
                            onClick={() => {
                                onEditBug(bug)
                            }}
                        >
                            Edit
                        </button>


                    </section>
                </li>
            )}
        </ul>
    )
}