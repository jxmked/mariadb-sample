#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import subprocess
import random
import string

"""
Uppercase first letter and keep the rest
"""
def ucfirst(param):
    param = str(param)
    return f"{param[0].upper()}{param[1::]}"

def clrscr():
    if os.name == "nt": # Windows
        subprocess.run("cls", shell=True)
    
    else: # Linux, Unix, macOS
        subprocess.check_call(["clear"], stderr=subprocess.STDOUT)
    
def random_letters(length=8):
    return "".join([random.choice(string.ascii_letters) for _ in range(length)])
    
def is_empty(s):
    return s is None or len(s) == 0

def flat_dict_compare(x, y):
    if len(x) != len(y):
        return False
    
    for key, value in x.items():
        if key not in y or str(y[key]) != str(value):
            return False
    
    return True
