#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Print Selection
"""

from utils.console_in import ConsoleIn
from utils.helpers import ucfirst

class Selections:
    
    __line__ = ("*~" * 20) + "*"
    capitalize_items = True
    
    def __init__(self, desc=None):
        self.menus = []
        self.__desc__ = (None if desc is None else desc)
    
    def insert(self, item):
        self.menus.append(item)
    
    def sort(self):
        # https://stackoverflow.com/a/36156/11481602
        self.menus.sort(key=str.lower)
    
    def __selections__(self):
        
        maxNum = 0
        
        print(Selections.__line__)
        
        if self.__desc__ is not None:
            print(self.__desc__)
            print("")
        
        print("Select an item to proceed:")
        
        # print selection list
        for k, item in enumerate(self.menus):
            
            item = (ucfirst(item) if Selections.capitalize_items else item)
            
            print(f"{k + 1}. {item}")
            
            maxNum = k + 1
        
        print(Selections.__line__)
        
        # Get selected item from input
        
        while True:
            selected = int(ConsoleIn("Number: "))
            
            # If selected is greater than 0 AND
            # selected is Lessthan or equal to maxNum
            if selected > 0 and selected <= maxNum:
                return selected
    
    def __str__(self):
        return str(self.__selections__())
        
    def __int__(self):
        return self.__selections__()
    
