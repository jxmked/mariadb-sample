#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import random
import string
import subprocess

"""
Uppercase first letter and keep the rest
"""


def ucfirst(param):
    param = str(param)
    return f"{param[0].upper()}{param[1::]}"


def clrscr():
    if os.name == "nt":  # Windows
        subprocess.run("cls", shell=True)

    else:  # Linux, Unix, macOS
        subprocess.check_call(["clear"], stderr=subprocess.STDOUT)


def random_letters(length=8):
    return "".join([random.choice(string.ascii_letters) for _ in range(length)])


def is_empty(s):
    # if isinstance(s, int):
    #     return s == 0
    return s is None or len(s) == 0


def flat_dict_compare(x, y):
    if len(x) != len(y):
        return False

    for key, value in x.items():
        if key not in y or str(y[key]) != str(value):
            return False

    return True

# Source: https://chat.openai.com/chat
# Sorry for this. Hahaha


def get_letter(num, lowercase=False):
    letters = ''
    letter_index = (97 if lowercase else 65)
    while num > 0:
        num -= 1
        letters = chr(letter_index + num % 26) + letters
        num //= 26
    return letters

# Source: https://chat.openai.com/chat
# Sorry for this. Hahaha:


def get_num(letters):
    num = 0
    letter_index = (97 if ord(letters[:1:]) >= 97 else 65)
    for letter in letters:
        num = (num * 26 + ord(letter) - letter_index) + 1
    return num

# Preserve message for later use
# Return true if has message otherwise false
# Automatically reset after return the preserve message


def premes(msg=None):
    if msg is True:
        pre_mes = os.environ.get("__premes_msg__")
        os.environ["__premes_msg__"] = "False"
        return pre_mes

    if msg not in [None, False, 0, "False"]:
        os.environ["__premes_msg__"] = msg

    return not os.environ.get("__premes_msg__", "False") == "False"
