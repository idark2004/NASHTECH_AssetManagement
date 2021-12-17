import React from 'react'

export default function Pagination() {
    return (
        <div className="pagination">
            <div className="pagination-wrapper">
                <button className="btn btn_previous">Previous</button>
                <ol className="pagination-list">
                    <li>
                        <span>
                            <div className="page_number active" id="span-1">
                                <p>1</p>
                            </div>
                        </span>
                    </li>
                    <li>
                        <span>
                            <div className="page_number" id="span-2">
                                <p>2</p>
                            </div>
                        </span>
                    </li>
                    <li>
                        <span>
                            <div className="page_number" id="span-3">
                                <p>3</p>
                            </div>
                        </span>
                    </li>
                </ol>
                <button className="btn btn_next">Next</button>
            </div>
        </div>
    )
}
