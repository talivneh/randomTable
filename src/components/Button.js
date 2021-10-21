import React from 'react'
import './Button.css'

function Button(props) {
    return (
        <button id={props.id} className={props.class}>{props.name}</button>
    )
}

export default Button
