"use strict";

let inputEntry = document.getElementById(`entryInput`);
let inputButton = document.getElementById(`entryButton`);

// This part will be removed, currently it clears the local storage on reload
(function initToDO() {
  let check = localStorage.getItem(`Table`);

  if (check === null) {
    let entries = [];
    let json = JSON.stringify(entries, null, 2);
    localStorage.setItem(`Table`, json);
  }

  buildTableFromLocalStorage();
})();

// This part will be removed, currently it clears the local storage on reload

inputButton.addEventListener(`click`, addEntryToLocalStorage);

function addEntryToLocalStorage() {
  if (inputEntry.value === ``) {
    inputEntry.focus();
    return;
  }
  let entry = [0, `${inputEntry.value}`];

  let entriesJSON = localStorage.getItem(`Table`);
  let entries = JSON.parse(entriesJSON);
  entries.push(entry);
  localStorage.setItem(`Table`, JSON.stringify(entries));

  inputEntry.value = "";

  buildTableFromLocalStorage();
}

function removeRow() {
  this.parentElement.remove();
}

function updateLocalStorage() {
  let localStorageEntries = JSON.parse(localStorage.getItem(`Table`));
  let table = document.querySelector(`.entries-table`);
  let entryIndex = Array.from(table.children).indexOf(this.parentElement);
  localStorageEntries.splice(entryIndex, 1);
  localStorage.setItem(`Table`, JSON.stringify(localStorageEntries));
}

function checkEntryDone() {
  let localStorageEntries = JSON.parse(localStorage.getItem(`Table`));
  let table = document.querySelector(`.entries-table`);
  let entryIndex = Array.from(table.children).indexOf(this.parentElement);
  localStorageEntries[entryIndex][0] =
    localStorageEntries[entryIndex][0] === 0 ? 1 : 0;
  localStorage.setItem(`Table`, JSON.stringify(localStorageEntries));

  buildTableFromLocalStorage();
}

function redactEntry() {
  let input = document.createElement(`input`);
  input.value = `${this.parentElement.firstElementChild.textContent}`;

  input.addEventListener(`blur`, () => {
    let td = document.createElement(`td`);
    td.classList.add(`entry-description`);
    td.textContent = input.value;

    let localStorageEntries = JSON.parse(localStorage.getItem(`Table`));
    let table = document.querySelector(`.entries-table`);
    let entryIndex = Array.from(table.children).indexOf(this.parentElement);
    localStorageEntries[entryIndex][1] = td.textContent;
    localStorage.setItem(`Table`, JSON.stringify(localStorageEntries));

    input.parentElement.firstElementChild.replaceWith(td);
  });

  input.addEventListener(`keypress`, (e) => {
    if (e.key === `Enter`) {
      let td = document.createElement(`td`);
      td.classList.add(`entry-description`);
      td.textContent = input.value;

      let localStorageEntries = JSON.parse(localStorage.getItem(`Table`));
      let table = document.querySelector(`.entries-table`);
      let entryIndex = Array.from(table.children).indexOf(this.parentElement);
      localStorageEntries[entryIndex][1] = td.textContent;
      localStorage.setItem(`Table`, JSON.stringify(localStorageEntries));

      input.parentElement.firstElementChild.replaceWith(td);
    }
  });

  this.parentElement.firstElementChild.replaceWith(input);

  setTimeout(() => {
    input.focus();
  }, 100);
}

function buildTableFromLocalStorage() {
  // Clearing table
  let table = document.querySelector(`.entries-table`);
  let entries = table.querySelectorAll(`tr`);
  entries.forEach((entry) => entry.remove());

  // Getting the Local Storage Information and building a table;
  let localStorageEntries = JSON.parse(localStorage.getItem(`Table`));
  for (let entry of localStorageEntries) {
    let tr = document.createElement(`tr`);

    let description = document.createElement(`td`);
    description.classList.add(`entry-description`);
    description.textContent = entry[1];

    // Checking if the entry has been marked as "Done"
    if (entry[0] === 1) {
      description.classList.add(`done`);
    }

    let checkmark = document.createElement(`td`);
    checkmark.classList.add(`entry-checkmark`);
    checkmark.addEventListener(`click`, checkEntryDone);

    let redact = document.createElement(`td`);
    redact.classList.add(`entry-redact`);
    redact.addEventListener(`click`, redactEntry);

    let remove = document.createElement(`td`);
    remove.classList.add(`entry-remove`);
    remove.addEventListener(`click`, updateLocalStorage);
    remove.addEventListener(`click`, removeRow);

    tr.appendChild(description);
    tr.appendChild(checkmark);
    tr.appendChild(redact);
    tr.appendChild(remove);
    table.appendChild(tr);
  }
}

// {
//     "isDone": 0,
//     "Description": "Dummy Text"
// },
// {
//     "isDone": 0,
//     "Description": "Dummy Text2"
// },
// {
//     "isDone": 1,
//     "Description": "Dummy Text3"
// }
