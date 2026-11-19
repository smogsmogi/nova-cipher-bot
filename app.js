const log = document.querySelector("#log");
const form = document.querySelector("#composer");
const field = document.querySelector("#text");

function addMessage(role, text, canCopy) {
  const item = document.createElement("li");
  item.className = role;

  const who = document.createElement("p");
  who.className = "who";
  who.textContent = role === "you" ? "Ты" : "Nova";

  const bubble = document.createElement("p");
  bubble.className = "bubble";
  bubble.textContent = text;

  item.append(who, bubble);

  if (canCopy) {
    const copy = document.createElement("button");
    copy.type = "button";
    copy.className = "copy";
    copy.textContent = "Копировать";
    copy.addEventListener("click", async () => {
      await navigator.clipboard.writeText(text);
      copy.textContent = "Скопировано";
      window.setTimeout(() => {
        copy.textContent = "Копировать";
      }, 1200);
    });
    item.append(copy);
  }

  log.append(item);
  item.scrollIntoView({ block: "end", behavior: "smooth" });
}

function resizeField() {
  field.style.height = "auto";
  field.style.height = `${field.scrollHeight}px`;
}

addMessage(
  "bot",
  "Напиши текст — я верну шифр.\nЕсли нужно обратно, переключись на «Расшифровать»."
);

field.addEventListener("input", resizeField);

field.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  const text = field.value.trim();
  if (!text) return;

  const mode = form.mode.value;
  addMessage("you", text);
  field.value = "";
  resizeField();

  const result = mode === "decrypt" ? decrypt(text) : encrypt(text);
  window.setTimeout(() => addMessage("bot", result, true), 220);
  field.focus();
});
