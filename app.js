const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const list = document.getElementById("noteList");

let notes = JSON.parse(localStorage.getItem("notes")) || [];

function save() {
  localStorage.setItem("notes", JSON.stringify(notes));
}

function render() {
  list.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");

    const text = document.createElement("span");
    text.textContent = note;

    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.type = "button";
    delBtn.addEventListener("click", () => {
      notes.splice(index, 1);
      save();
      render();
    });

    li.appendChild(text);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  notes.push(value);
  input.value = "";
  save();
  render();
});

render();
