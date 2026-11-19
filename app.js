const log = document.querySelector("#log");
const form = document.querySelector("#composer");
const field = document.querySelector("#text");
const stats = document.querySelector("#stats");

const VISITS_KEY = "nova-cipher-bot-smogsmogi-visits";
const SENDS_KEY = "nova-cipher-bot-smogsmogi-sends";

function plural(count, one, few, many) {
  const abs = Math.abs(count);
  const last = abs % 10;
  const lastTwo = abs % 100;
  if (last === 1 && lastTwo !== 11) return `${count} ${one}`;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return `${count} ${few}`;
  return `${count} ${many}`;
}

function showStats(visits, sends) {
  const parts = [];
  if (Number.isFinite(visits)) parts.push(plural(visits, "визит", "визита", "визитов"));
  if (Number.isFinite(sends)) parts.push(plural(sends, "отправка", "отправки", "отправок"));
  stats.textContent = parts.join(" · ");
}

async function counter(key, action) {
  const response = await fetch(`https://countapi.mileshilliard.com/api/v1/${action}/${key}`);
  if (response.status === 404) return 0;
  if (!response.ok) throw new Error("counter");
  const data = await response.json();
  return Number(data.value);
}

async function refreshStats(countVisit) {
  try {
    const [visits, sends] = await Promise.all([
      counter(VISITS_KEY, countVisit ? "hit" : "get"),
      counter(SENDS_KEY, "get"),
    ]);
    stats.dataset.visits = String(visits);
    stats.dataset.sends = String(sends);
    showStats(visits, sends);
    return { visits, sends };
  } catch {
    return null;
  }
}

const countThisVisit = !sessionStorage.getItem("nova-cipher-visit");
if (countThisVisit) sessionStorage.setItem("nova-cipher-visit", "1");
refreshStats(countThisVisit);

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

  counter(SENDS_KEY, "hit")
    .then((sends) => {
      const visits = Number(stats.dataset.visits);
      stats.dataset.sends = String(sends);
      showStats(Number.isFinite(visits) ? visits : undefined, sends);
    })
    .catch(() => {});
});
