import React from 'react'
import './TopSection.css'
import Button from './Button';
import Tag from './Tag'

export default function TopSection() {
    return (
        <div className="add-and-filter-div">
            <div>
                <input type="text" placeholder="Add new name" id="name-input" />
                <Button name="&#43;" id="add-name-btn" class="add-name-btn-class" />
            </div>
            <div>
                <input type="text" placeholder="Filter by name" id="filter-input" />
                <Button name="Filter" id="filter-btn" class="filter-btn-class" />
            </div>
            <section id="filter-table-tags-section">

            </section>
        </div>
    )
}
