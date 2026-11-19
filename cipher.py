#!/usr/bin/env python3
"""NOVA CIPHER: одна русская буква → один декоративный символ."""

import argparse
import os
import random
import re
import subprocess
import sys

ALPHABET = {
    "А": ["Å", "Δ", "Ⱥ", "А"],
    "Б": ["ƃ", "Ђ"],
    "В": ["В", "ß"],
    "Г": ["Ґ", "Г"],
    "Д": ["Д", "Đ"],
    "Е": ["Σ", "Ę", "Ξ"],
    "Ё": ["Ë", "Ё"],
    "Ж": ["Ж", "Җ"],
    "З": ["3", "Ʒ", "Ȥ", "Ƶ"],
    "И": ["И", "N"],
    "Й": ["Ӣ", "Ӣ", "Ū"],
    "К": ["Ҝ", "Ƙ", "₭"],
    "Л": ["Ӆ", "Λ", "Л"],
    "М": ["М", "M"],
    "Н": ["Н", "H"],
    "О": ["Ø", "Ѻ", "⊘"],
    "П": ["П"],
    "Р": ["ᑭ", "Р"],
    "С": ["С", "Ϲ"],
    "Т": ["Ţ", "Ŧ", "T", "卞"],
    "У": ["Ⴘ", "Y", "Ÿ", "Ⴤ"],
    "Ф": ["Ф"],
    "Х": ["Ҳ", "X"],
    "Ц": ["Џ", "Ц"],
    "Ч": ["Ⴗ", "Ч"],
    "Ш": ["Ш"],
    "Щ": ["Щ"],
    "Ъ": ["Ъ"],
    "Ы": ["Ы"],
    "Ь": ["ᕊ", "Ь"],
    "Э": ["Є", "Э"],
    "Ю": ["Ю"],
    "Я": ["Я"],
}

REVERSE = {
    symbol: letter
    for letter, symbols in ALPHABET.items()
    for symbol in symbols
}

DECRYPT_TITLES = {"decrypt", "/decrypt", "расшифровка", "расшифровать"}


def encrypt(text):
    result = []
    for character in text:
        letter = character.upper()
        if letter in ALPHABET:
            result.append(random.choice(ALPHABET[letter]))
        else:
            result.append(character)
    return "".join(result)


def decrypt(text):
    result = []
    for character in text:
        result.append(REVERSE.get(character, character))
    return "".join(result)


def clean_text(text):
    without_comments = re.sub(r"<!--.*?-->", "", text or "", flags=re.DOTALL)
    return without_comments.strip()


def resolve(text, title="", mode="auto"):
    body = clean_text(text)
    title_key = (title or "").strip().lower()
    if mode == "encrypt":
        return "encrypt", body
    if mode == "decrypt" or title_key in DECRYPT_TITLES:
        if body.lower().startswith("/decrypt"):
            body = body[8:].strip()
        return "decrypt", body
    if body.lower().startswith("/decrypt"):
        return "decrypt", body[8:].strip()
    return "encrypt", body


def transform(text, title="", mode="auto"):
    action, payload = resolve(text, title, mode)
    if not payload:
        return action, ""
    if action == "decrypt":
        return action, decrypt(payload)
    return action, encrypt(payload)


def reply(action, result):
    if not result:
        return (
            "Вставь текст в сообщение.\n\n"
            "Обычный текст я зашифрую.\n"
            "Чтобы расшифровать, начни текст с `/decrypt` "
            "или назови issue `decrypt`."
        )
    label = "Расшифровка" if action == "decrypt" else "Шифр"
    return f"🖤 NOVA CIPHER\n\n**{label}**\n\n```\n{result}\n```"


def post_issue_comment(number, body):
    subprocess.run(
        ["gh", "issue", "comment", str(number), "--body-file", "-"],
        input=body.encode(),
        check=True,
    )


def run_github():
    action, result = transform(
        os.environ.get("TEXT", ""),
        os.environ.get("TITLE", ""),
        os.environ.get("MODE", "auto"),
    )
    message = reply(action, result)
    summary = os.environ.get("GITHUB_STEP_SUMMARY")
    if summary:
        with open(summary, "a", encoding="utf-8") as handle:
            handle.write(message + "\n")
    print(message)
    issue = os.environ.get("ISSUE_NUMBER", "").strip()
    if issue:
        post_issue_comment(issue, message)


def main():
    if os.environ.get("GITHUB_ACTIONS") == "true" and "--github" in sys.argv:
        run_github()
        return

    parser = argparse.ArgumentParser(description="NOVA CIPHER")
    parser.add_argument("text", nargs="*", help="Текст. Без аргументов читается stdin.")
    parser.add_argument("--decrypt", action="store_true", help="Расшифровать вместо шифрования.")
    args = parser.parse_args()

    raw = " ".join(args.text) if args.text else sys.stdin.read()
    action, result = transform(raw, mode="decrypt" if args.decrypt else "encrypt")
    if not result:
        parser.error("нужен текст")
    sys.stdout.write(result + ("\n" if not result.endswith("\n") else ""))


if __name__ == "__main__":
    main()
