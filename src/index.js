import React from 'react';
import ReactDOM from 'react-dom';
import ReactDOMServer from "react-dom/server";

import './index.css';
import Tag from './components/Tag'
import Button from './components/Button'
import App from './App';

ReactDOM.render(
    <App />,
    document.getElementById('root')
);

function refreshTable() {
    fetch('https://rendom-table-app.herokuapp.com/getAll')
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

document.addEventListener('DOMContentLoaded', function () {
    refreshTable();
});

document.querySelector('table tbody').addEventListener('click', function (event) {
    if (event.target.className === "delete-row-btn") {
        deleteRowById(event.target.id)
    }
    if (event.target.className === "edit-row-btn") {
        handelEditRow(event.target.id)
    }
})


function deleteRowById(id) {
    fetch('https://rendom-table-app.herokuapp.com/delete/' + id, {
        method: 'DELETE'
    })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                refreshTable();
            }
        });
}

let rowInUpdateMode= false;
let updateSection = "";
let updateBtn = "";
let updateNameInput = "";
let currentName =""; 

function handelEditRow(id) {
    if(!rowInUpdateMode){
    rowInUpdateMode = true;
    updateSection = document.querySelector("#update-row-section-" + id);
    updateBtn = document.querySelector("#update-name-btn-" + id);
    updateNameInput = document.querySelector("#update-name-input-" + id);
    currentName = document.querySelector("#name-label-" + id);

    updateSection.hidden = false;
    updateBtn.dataset.id = id;
    updateNameInput.value = currentName.innerText;

    currentName.hidden = true;

    updateBtn.onclick = function () {
        if (updateNameInput.value.length !== 0) {
            fetch('https://rendom-table-app.herokuapp.com/update', {
                method: 'PATCH',
                headers: {
                    'Content-type': 'application/json'
                },
                body: JSON.stringify({
                    id: updateBtn.dataset.id,
                    name: updateNameInput.value
                })
            })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        refreshTable();
                    }
                })
            updateNameInput.value = "";
            updateSection.setAttribute("hidden", true);
        }
        currentName.hidden = false;
    }
} else{
    currentName.hidden = false;
    updateSection.setAttribute("hidden", true);
    rowInUpdateMode = false;
    handelEditRow(id);
}
}


const addBtn = document.querySelector("#add-name-btn");

addBtn.onclick = function () {
    const nameInput = document.querySelector("#name-input");
    const name = nameInput.value;
    if (name.length !== 0) {
        nameInput.value = "";

        fetch('https://rendom-table-app.herokuapp.com/insert', {
            headers: {
                'Content-type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({ name: name })
        })
            .then(response => response.json())
            .then(data => refreshTable());
    }
}

// function insertRowIntoTable(data) {

//     const table = document.querySelector("table tbody");
//     const isTableData = table.querySelector(".no-data");

//     let tableHTML = '<tr>';

//     for (var key in data) {
//         if (data.hasOwnProperty(key)) {
//             if (key === "dateAdded") {
//                 data[key] = new Date(data[key]).toLocaleDateString();
//             }
//         }
//         tableHTML += `<td>${data[key]}</td>`
//     }

//     tableHTML += `<td><button class="delete-row-btn" data-id=${data.id}>Delete</button></td>`;
//     tableHTML += `<td><button class="edit-row-btn" data-id=${data.id}>Edit</button></td>`;
//     tableHTML += '</tr>';

//     if (isTableData) {
//         table.innerHTML = tableHTML;
//     }
//     else {
//         const newRow = table.insertRow();
//         newRow.innerHTML = tableHTML;
//     }
// }

const filterBtn = document.querySelector("#filter-btn");

filterBtn.addEventListener('click', function (event) {
    filterFunction(event);
});

let filterValues = [];

function filterFunction(event) {
    if (event.target.id === 'filter-btn') {
        const filter = document.querySelector("#filter-input");
        if (filter.value.length !== 0 && !filterValues.includes(filter.value)) {
            filterValues[filterValues.length] = filter.value;
            if (filterValues.length >= 1) {
                filter.value = "";
                HandleFilterTag(filterValues);
            }
            sendToFilter();
        }
        filter.value = "";
    }
    else {
        filterValues.splice(filterValues.indexOf(event.target.innerHTML), 1);
        console.log(event.target);
        event.target.remove();
        if (filterValues.length === 0) {
            fetch('https://rendom-table-app.herokuapp.com/getAll')
                .then(response => response.json())
                .then(data => loadHTMLTable(data['data']));

            return;
        }
        sendToFilter();
    }
}

function sendToFilter() {
    fetch('https://rendom-table-app.herokuapp.com/filter/' + [filterValues])
        .then(response => response.json())
        .then(data => loadHTMLTable(data['data']));
}

function HandleFilterTag(names) {

    const tagsSection = document.querySelector("#filter-table-tags-section");
    tagsSection.innerHTML = "";

    if (names.length === 1) {
        tagsSection.innerHTML =  ReactDOMServer.renderToString(<Tag class="filter-name-tag" style="vertical-align:middle" name={names}/>);
        tagsSection.hidden = false;
    }
    else {
        names.forEach(name => {
            const newTag = ReactDOMServer.renderToString(<Tag class="filter-name-tag" style="vertical-align:middle" name={name}/>);
            tagsSection.innerHTML += newTag
        });
    }

    const filterNameTag = document.querySelectorAll(".filter-name-tag");

    filterNameTag.forEach(filter => {
        filter.addEventListener('click', function (event) {
            filterFunction(event)
        });
    })
}

function loadHTMLTable(data) {
    const table = document.querySelector("table tbody");

    if (data.length === 0) {
        table.innerHTML = "<tr><td class='no-data' colspan='5'>No Data</td></tr>";
        return;
    }

    let tableHTML = "";
    data.forEach(function ({ ID, name, date_added }) {
        tableHTML += '<tr>';
        tableHTML += `<td>${ID}</td>`;
        tableHTML += `<td class="name-td-${ID}" id=${ID}><label id="name-label-${ID}">${name}</label>
      <section hidden id="update-row-section-${ID}" class="update-row-section">
      <input type="text" id="update-name-input-${ID}" class="edit-name-input"/>
    <button class="update-name-btn-class" id="update-name-btn-${ID}" name="">&#10004</button>
     </section></td>`;
        tableHTML += `<td>${new Date(date_added).toLocaleDateString()}</td>`;
        tableHTML += `<td class="delete-row-btn-td">${ReactDOMServer.renderToString(<Button class="delete-row-btn" data-id={ID} id={ID} name="Delete"/>)}</td>`;
        tableHTML += `<td class="edit-row-btn-td">${ReactDOMServer.renderToString(<Button class="edit-row-btn" data-id={ID} id={ID} name="Edit"/>)}</td>`;
        tableHTML += '</tr>';
    });

    table.innerHTML = tableHTML;
}