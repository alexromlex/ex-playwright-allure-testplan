import {valid_names, valid_emails, valid_phones, invalid_emails, invalid_names, invalid_phones} from "./user_data"

export const required_inputs = [
    {
        "name": "name",
        "type": "input",
        "find_by": {"id": "name", "name": "name"},
        // "props": {"maxlength": 100, "minlength": 2},
    },
    {
        "name": "email",
        "type": "input",
        "find_by": {"id": "email", "name": "email"},
        // "props": {"maxlength": 254, "minlength": 5},    // 64 before@
    },
    {
        "name": "telefon",
        "type": "input",
        "find_by": {"id": "telefon", "name": "telefon"},
        // "props": {"maxlength": 50, "minlength": 3},
    },
    // {"name": "kezdes", "type": "select", "find_by": {"id": "kezdes", "name": "kezdes"}},
    {"name": "honnan", "type": "select", "find_by": {"id": "honnan", "name": "honnan"}},
    {"name": "captcha", "type": "input", "find_by": {"name": "scode"}, "props": {"maxlength": 2, "minlength": 1}},
]

export const random_values = [
    {"name": "name", "type": "input", "value": valid_names[Math.floor(Math.random() * valid_names.length)]},
    {"name": "email", "type": "input", "value": valid_emails[Math.floor(Math.random() * valid_emails.length)]},
    {"name": "telefon", "type": "input", "value": valid_phones[Math.floor(Math.random() * valid_phones.length)]},
    {"name": "honnan", "type": "select", "value": Math.floor(Math.random() * 4) + 1},
]

export const random_invalid = [
    {"name": "name", "type": "input", "value": invalid_names[Math.floor(Math.random() * invalid_names.length)]},
    {"name": "email", "type": "input", "value": invalid_emails[Math.floor(Math.random() * invalid_emails.length)]},
    {"name": "telefon", "type": "input", "value": invalid_phones[Math.floor(Math.random() * invalid_phones.length)]},
    {"name": "honnan", "type": "select", "value": Math.floor(Math.random() * 4) + 1},
]

export const minimal_values = [
    {"name": "name", "type": "input", "value": valid_names[0]},
    {"name": "email", "type": "input", "value": valid_emails[0]},
    {"name": "telefon", "type": "input", "value": valid_phones[0]},
    {"name": "honnan", "type": "select", "value": 1},
]

export const out_minimal_values = [
    {"name": "name", "type": "input", "value": invalid_names[1]},
    {"name": "email", "type": "input", "value": invalid_emails[1]},
    {"name": "telefon", "type": "input", "value": invalid_phones[1]},
    {"name": "honnan", "type": "select", "value": 0},
]

export const maximum_values = [
    {"name": "name", "type": "input", "value": valid_names[1]},
    {"name": "email", "type": "input", "value": valid_emails[1]},
    {"name": "telefon", "type": "input", "value": valid_phones[1]},
    {"name": "honnan", "type": "select", "value": Math.floor(Math.random() * 4) + 1},
]

export const out_maximum_values = [
    {"name": "name", "type": "input", "value": invalid_names[2]},
    {"name": "email", "type": "input", "value": invalid_emails[2]},
    {"name": "telefon", "type": "input", "value": invalid_phones[2]},
    {"name": "honnan", "type": "select", "value": 0},
]