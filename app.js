const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const list = document.getElementById("noteList");

const STORAGE_KEY = "notes";

// Load notes from localStorage.
// Supports BOTH old format (["text", "text"]) and new format ([{text, done}, ...])
let notes = (() => {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    return raw.map((item) =>
      typeof item === "string" ? { text: item, done: false } : item
    );
  } catch {
    return [];
  }
})();

function save() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
}

function render() {
  list.innerHTML = "";

  notes.forEach((note, index) => {
    const li = document.createElement("li");
    li.className = note.done ? "done" : "";

    // Left side: checkbox + text
    const left = document.createElement("div");
    left.className = "left";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = note.done;
    checkbox.addEventListener("change", () => {
      notes[index].done = checkbox.checked;
      save();
      render();
    });

    const text = document.createElement("span");
    text.textContent = note.text;

    left.appendChild(checkbox);
    left.appendChild(text);

    // Right side: delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.type = "button";
    delBtn.addEventListener("click", () => {
      notes.splice(index, 1);
      save();
      render();
    });

    li.appendChild(left);
    li.appendChild(delBtn);
    list.appendChild(li);
  });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const value = input.value.trim();
  if (!value) return;

  notes.push({ text: value, done: false });
  input.value = "";
  save();
  render();
});

render();
