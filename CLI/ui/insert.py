#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from database import Database
from utils.helpers import clrscr, get_letter, get_num, is_empty
from utils.option_selection import OptionSelection as Selections
from model.pagination import Pagination
from prettytable import PrettyTable
import re

class UIInsert(Database):
    
    per_page = 15
    
    def __init__(self):
        super().__init__()
        
        self.data = self.get()
        self.paginate = None
        self.item_count = 0
        self.current_page = 0
        self.reload()
        self.current_item_length = 0
        has_next = True
        has_prev = False
        
        while True:
            # Update our current page 
            self.current_page = self.paginate.page
            
            clrscr()
            
            self.intro()
            print("Check the items before inserting")
            print(f"Viewing data page {self.paginate.page + 1} out of {self.item_count} items")
            
            items = self.paginate()
            self.current_item_length = len(items)
            self.print_data(items)
            print("")
            
            has_prev = not self.current_page == 0 
            has_next = not ((1 + self.current_page) * UIInsert.per_page) > self.item_count
            
            act = self.action(has_next, has_prev)
            
            # switch
            # match is not a switch
            if act == "refresh": # Refresh
                self.reload()
            
            elif act == "insert": # Open insert form
                pass
            
            elif act == "next": # Next
                self.paginate.next()
            
            elif act == "prevous": # Prevous
                self.paginate.prev()
                
            elif act == "back":
                break
            
            else:
                pass
            
        return
            
    def reload(self):
        self.data = self.get()
        self.item_count = len(self.data)
        self.paginate = Pagination(self.data, UIInsert.per_page, self.current_page)
        
    
    def intro(self):
        pass
    
    def __action_selection_validator(self, max_item, value):
        
        if not re.match(r'^([0-9a-zA-Z]+)$', value):
            return False
        
        # Check if the value is a number
        # If a number, the user intended to do navigate
        try:
            parsed_value = int(value)
            
            if parsed_value > 0 and parsed_value <= max_item:
                return True
        except:
            pass
        
        # If not a number, the user intended to do something
        # In table
        
        num = get_num(value)
        
        if num > 0 and num <= self.current_item_length:
            return True
        
        return False
        
    def action(self, has_next, has_prev):
        dm = Selections()
        
        dm.validator(self.__action_selection_validator)
        
        dm.insert("Refresh")
        dm.insert("Insert")
        
        if has_next:
            dm.insert("Next")
            
        if has_prev:
            dm.insert("Prevous")
        
        dm.insert("Back")
        response = str(dm)
        
        # Check if its a number
        try:
            return dm.menus[int(response) - 1].lower()
        except:
            pass
        
        return response.lower()
    
    def print_data(self, items):
        table = PrettyTable()
        table.field_names = ["#", "Name", "Color"]
        
        table.align['#.'] = "c"
        table.align["Name"] = "c"
        table.align["Color"] = "c"
        
        for k, item in enumerate(items):
            table.add_row([get_letter(k + 1), item.get("name"), item.get("color")])
        
        print(table)
        