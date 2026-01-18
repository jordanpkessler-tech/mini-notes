const form = document.getElementById("noteForm");
const input = document.getElementById("noteInput");
const list = document.getElementById("noteList");

const STORAGE_KEY = "notes";

// Load notes from localStorage.
// Supports old format (["text"]) and new format ([{text, done}, ...])
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

    // Left: checkbox + content
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

    // Content area (either text OR an edit input)
    const content = document.createElement("div");
    content.className = "content";

    const text = document.createElement("span");
    text.className = "note-text";
    text.textContent = note.text;
    text.title = "Click to edit";

    function startEditing() {
      // Prevent multiple editors at once by re-rendering cleanly
      render();

      const editLi = list.children[index];
      const editContent = editLi.querySelector(".content");
      const editSpan = editLi.querySelector(".note-text");

      const editInput = document.createElement("input");
      editInput.type = "text";
      editInput.className = "edit-input";
      editInput.value = editSpan.textContent;

      editContent.replaceChildren(editInput);
      editInput.focus();
      editInput.setSelectionRange(editInput.value.length, editInput.value.length);

      const original = note.text;

      function commitEdit() {
        const val = editInput.value.trim();
        if (val) {
          notes[index].text = val;
          save();
        } else {
          // If they delete everything, revert to original text
          notes[index].text = original;
        }
        render();
      }

      function cancelEdit() {
        notes[index].text = original;
        render();
      }

      editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") commitEdit();
        if (e.key === "Escape") cancelEdit();
      });

      // Save when you click away
      editInput.addEventListener("blur", commitEdit);
    }

    text.addEventListener("click", startEditing);

    content.appendChild(text);
    left.appendChild(checkbox);
    left.appendChild(content);

    // Right: delete
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
