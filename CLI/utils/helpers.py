#!/usr/bin/env python3
# -*- coding: utf-8 -*-

import os
import subprocess

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
    
