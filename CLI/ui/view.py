#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from prettytable import PrettyTable
from utils.helpers import clrscr
from utils.selections import Selections
from model.pagination import Pagination

class UIView(Database):
    
    per_page = 10
    
    def __init__(self):
        super().__init__()
        
        self.data = self.get()
        self.paginate = None
        self.item_count = 0
        self.current_page = 0
        self.reload()

        has_next = True
        has_prev = False
        
        while True:
            # Update our current page 
            self.current_page = self.paginate.page
            
            clrscr()
            
            self.intro()
            
            print(f"Viewing data page {self.paginate.page + 1} out of {self.item_count} items")
            
            self.print_data(self.paginate())
            
            print("")
            
            has_prev = False if self.current_page == 0 else True
            has_next = False if ((1 + self.current_page) * UIView.per_page) >= self.item_count else True
            
            act = self.action(has_next, has_prev)
            
            # switch
            # match is not a switch
            if act == "refresh": # Refresh
                self.reload()
            
            elif act == "next": # Next
                self.paginate.next()
            
            elif act == "prevous": # Prevous
                self.paginate.prev()
                
            else: # Back
                break
        
        return
            
    def reload(self):
        self.data = self.get()
        self.item_count = len(self.data)
        self.paginate = Pagination(self.data, UIView.per_page, self.current_page)
        
    
    def intro(self):
        pass
    
    def action(self, has_next, has_prev):
        dm = Selections()
        dm.insert("Refresh")
        
        if has_next:
            dm.insert("Next")
        if has_prev: #Fuck
            dm.insert("Prevous")
        
        dm.insert("Back")
        
        return str(dm).lower()
    
    def print_data(self, items):
        table = PrettyTable()
        table.field_names = ["#", "Name", "Color"]
        
        table.align['#'] = "c"
        table.align["Name"] = "c"
        table.align["Color"] = "c"
        
        for k, item in enumerate(items):
            table.add_row([k + 1, item.get("name"), item.get("color")])
        
        print(table)
        
       