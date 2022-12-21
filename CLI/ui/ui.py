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
        clrscr()
        print("")
        print("These an action you can do with the program")
        print("")
        
        self.menu()
    
    def menu(self):
        
        dm = Selections("Select a program to continue")
        dm.insert("Insert new item")
        dm.insert("Modify item")
        dm.insert("Delete item")
        dm.insert("Print all")
        dm.insert("Quit")
        
        response = int(dm)
        
        match(response):
            case 1:
                UIInsert()
                
            case 4:
                UIView()
            
