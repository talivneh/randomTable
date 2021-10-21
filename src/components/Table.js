import React, { Component } from 'react'
import './Table.css'

export class Table extends Component {
    render() {
        return (
            <div>
                <table id="table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Date</th>
                            <th>Delete</th>
                            <th>Edit Name</th>
                        </tr>
                    </thead>
                    <tbody></tbody>
                </table>
            </div>
        )
    }
}

export default Table
