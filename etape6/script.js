"use strict";

let lignes = 0;
let total_points = 0;
let sortAsc = true;

const persons = [
  { nom: "nom-1", prenom: "prenom-1", points: 5 },
  { nom: "nom-2", prenom: "prenom-2", points: 10 },
  { nom: "nom-3", prenom: "prenom-3", points: 15 },
];

init();

function init() {
  for (const person of persons) {
    doInsert(person.nom, person.prenom, person.points);
  }
}

function doInsert(nom, prenom, points) {
  total_points += points;
  lignes++;
  const num = lignes;
  doInsertRowTable(num, nom, prenom, points);
  update_summary();
}

function update_summary() {
  const element_lignes = document.getElementById("p1");
  const element_points = document.getElementById("p3");
  element_lignes.innerText = lignes + " ligne(s)";
  element_points.innerText = "Total point(s)= " + total_points;
}

function doInsertRowTable(num, nom, prenom, points) {
  const table = document.querySelector("#persons_table tbody");

  const row = document.createElement("tr");
  row.setAttribute("class", "row");

  const col1 = document.createElement("td");
  const col2 = document.createElement("td");
  const col3 = document.createElement("td");
  const col4 = document.createElement("td");
  const col5 = document.createElement("td");

  col1.innerText = num;
  col2.innerText = nom;
  col3.innerText = prenom;
  col4.innerText = points;

  const chk = document.createElement("input");
  chk.setAttribute("type", "checkbox");
  col5.append(chk);

  col1.setAttribute("class", "col_number");
  col2.setAttribute("class", "col_text");
  col3.setAttribute("class", "col_text");
  col4.setAttribute("class", "col_number");
  col5.setAttribute("class", "col_chkbox");

  row.append(col1, col2, col3, col4, col5);
  table.append(row);
}

function consoleTableau() {
  console.log(persons);
}

function doNewData() {
  const elt_nom = document.getElementById("form_nom");
  const elt_prenom = document.getElementById("form_prenom");
  const elt_points = document.getElementById("form_points");

  const nom = elt_nom.value.trim();
  const prenom = elt_prenom.value.trim();
  const points = parseInt(elt_points.value);

  if (nom === "" || prenom === "" || Number.isNaN(points)) {
    window.alert("Formulaire incomplet !");
  } else {
    doInsert(nom, prenom, points);
    persons.push({ nom: nom, prenom: prenom, points: points });
    elt_nom.value = "";
    elt_prenom.value = "";
    elt_points.value = "";
    applyFilter();
  }
}

function deleteRow() {
  if (lignes === 0) {
    window.alert("Le tableau est vide !");
    return;
  }

  const tbody = document.querySelector("#persons_table tbody");
  const checked = tbody.querySelectorAll(".col_chkbox input:checked");

  if (checked.length === 0) {
    window.alert("Sélectionnez au moins une ligne !");
    return;
  }

  if (
    !window.confirm(
      "Voulez-vous vraiment supprimer " + checked.length + " ligne(s) ?",
    )
  ) {
    return;
  }

  const rows = tbody.querySelectorAll("tr");

  for (let i = rows.length - 1; i >= 0; i--) {
    const chk = rows[i].querySelector(".col_chkbox input");
    if (chk.checked) {
      const pts = parseInt(rows[i].cells[3].innerText);
      total_points -= pts;
      lignes--;
      rows[i].remove();
      persons.splice(i, 1);
    }
  }

  renumberRows();
  document.getElementById("chk_all").checked = false;
  window.alert("Suppression effectuée avec succès !");
  update_summary();
}

function renumberRows() {
  const rows = document.querySelectorAll("#persons_table tbody tr");
  let n = 1;
  for (const row of rows) {
    row.cells[0].innerText = n;
    n++;
  }
}

function toggleAll(source) {
  const rows = document.querySelectorAll("#persons_table tbody tr");
  for (const row of rows) {
    if (row.style.display !== "none") {
      row.querySelector(".col_chkbox input").checked = source.checked;
    }
  }
}

function applyFilter() {
  const text = document
    .getElementById("search_field")
    .value.trim()
    .toLowerCase();
  const rows = document.querySelectorAll("#persons_table tbody tr");
  for (const row of rows) {
    const nom = row.cells[1].innerText.toLowerCase();
    const prenom = row.cells[2].innerText.toLowerCase();
    if (nom.includes(text) || prenom.includes(text)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  }
}

function sortByPoints() {
  if (sortAsc) {
    persons.sort((a, b) => a.points - b.points);
  } else {
    persons.sort((a, b) => b.points - a.points);
  }

  document.getElementById("btn_sort").innerText = sortAsc
    ? "Trier ▼"
    : "Trier ▲";
  sortAsc = !sortAsc;

  renderTable();
}

function renderTable() {
  const tbody = document.querySelector("#persons_table tbody");
  tbody.innerHTML = "";
  lignes = 0;
  total_points = 0;
  for (const person of persons) {
    doInsert(person.nom, person.prenom, person.points);
  }
  document.getElementById("chk_all").checked = false;
  applyFilter();
}
