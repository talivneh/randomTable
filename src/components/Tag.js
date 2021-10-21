import React from 'react'
import './Tag.css'

function Tag(props) {
    return (
        <button className={props.class}>{props.name}</button>
    )
}

export default Tag
