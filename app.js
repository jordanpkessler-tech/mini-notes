const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const list = document.getElementById("noteList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function render() {
  list.innerHTML = "";
  notes.forEach(note => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });
}

form.addEventListener("submit", e => {
  e.preventDefault();
  notes.push(input.value);
  input.value = "";
  localStorage.setItem("notes", JSON.stringify(notes));
  render();
});

render();
