#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from database import Database
from utils.helpers import clrscr, get_letter, get_num
from utils.option_selection import OptionSelection as MultiSelections
from utils.selections import Selections
from model.pagination import Pagination
from prettytable import PrettyTable
import re
from ui.insert_form import InsertForm
from ui.view_data import ViewData
from utils.console_in import ConsoleIn
from ui.empty_rows import EmptyRows


class UIInsert(Database):
    
    per_page = 15
    
    def __init__(self):
        super().__init__()
        
        self.data = []
        self.paginate = None
        self.item_count = 0
        self.current_page = 0
        self.reload()
        self.current_item_length = 0
        has_next = False
        has_prev = False
        
        while True:
            # Update our current page 
            self.current_page = self.paginate.page
            
            clrscr()
            
            self.intro()
            
            if self.item_count <= 0:
                EmptyRows()
                
            else:
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
                self.insert_data()
            
            elif act == "next": # Next
                self.paginate.next()
            
            elif act == "prevous": # Prevous
                self.paginate.prev()
                
            elif act == "back":
                break
            
            else:
                item_index = get_num(act)
                
                self.on_select(items[item_index - 1])
                pass
            
        return
    

    
    def on_select(self, item):
        # Handle events after selecting 
        # an item

        while True:
            clrscr()

            print("Item Selected")
            print("")
            ViewData(item)
            print("")

            dm = Selections("  Any action?")
            dm.insert("Modify")
            dm.insert("Delete")
            dm.insert("Back")

            response = dm.response
            
            
    def insert_data(self):
        clrscr()
        new_data = InsertForm(self.__insert_form_callback)
        response = new_data.response
        
        if response == {}:
            # Transaction Cancelled
            return 
        
        try:
            response['id'] = self.insert(**response)
        
        except:
            print("An error occured during inserting")
            print("Please, try again...")
            return
        
        clrscr()
        
        print("New Data has been inserted")
         
        ViewData(response)
        
        print("")
        
        str(ConsoleIn("Press enter to continue..."))
        
        # Auto reload during update
        self.reload()
        
    
    def reload(self):
        self.data = self.get()
        self.item_count = len(self.data)
        self.paginate = Pagination(self.data, UIInsert.per_page, self.current_page)
        
    
    def intro(self):
        pass
    
    def __action_selection_validator(self, max_item, value):
        
        # Did I made a mistake? =(
        if not re.match(r'^([0-9]+|[a-zA-Z]+)$', value):
            return False
        # 
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
        dm = MultiSelections()
        
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
        
    def __insert_form_callback(self, name):
        _id = self.__get_by_name__(name)
        
        return _id == {}
