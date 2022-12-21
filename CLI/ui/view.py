#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from prettytable import PrettyTable

class UIView(Database):
    
    
    def __init__(self):
        super().__init__()
        self.print_data()
        pass
    
    
    def action(self):
        pass
    
    def print_data(self):
        items = self.get()
        
        rows = []
        table = PrettyTable()
        table.field_names = ["#", "Name", "Color"]
        table.align['#'] = "c"
        for k, item in enumerate(items):
            
            table.add_row([k + 1, item.get("name"), item.get("color")])
        print(table)
        
        input()
    
    