#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
User Interface

"""

from utils.selections import Selections
from utils.helpers import clrscr
from ui.view import UIView
from ui.insert import UIInsert

class UserInterface:
    
    def __init__(self):
        while True:
            clrscr()
            print("")
            print("This is a selection of action you")
            print("  can do with the program")
            print("")
            
            if not self.menu():
                break

    def menu(self):
        
        dm = Selections("Select a program to continue")
        dm.insert("Insert new item")
        dm.insert("Modify item")
        dm.insert("Delete item")
        dm.insert("Print all")
        dm.insert("Quit")
        
        response = int(dm)
        
        if response == 1:
            UIInsert()
        
        elif response == 2:
            pass
        
        elif response == 3:
            pass
        
        elif response == 4:
            UIView()
        
        elif response== 5:
            return False
        
        return True

