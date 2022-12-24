#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
User Interface

"""

import re

from database import Database
from model.pagination import Pagination
from prettytable import PrettyTable
from ui.form_action.delete import Delete
from ui.form_action.insert import Insert
from ui.form_action.modify import Modify
from ui.snippets.empty_rows import EmptyRow
from ui.snippets.view_data import ViewData
from utils.helpers import clrscr, get_letter, get_num, premes
from utils.option_selection import OptionSelection as MultiSelections
from utils.selections import Selections


class UserInterface:

    def __init__(self):
        super().__init__()
        self.db = Database()
        self.per_page = 15
        self.data = []
        self.paginate = None
        self.item_count = 0
        self.current_page = 0
        self.current_item_length = 0
        self.reload()
        self.print_items()

    def intro(self):
        print("")

    def insert_data(self):
        Insert(self.db)

    def print_items(self):
        has_next = False
        has_prev = False
        preserve_message = None

        while True:
            # Need a refresh every hooks
            selection_list = {
                "refresh": self.reload,
                "next": self.paginate.next,
                "previous": self.paginate.prev,
                "insert": self.insert_data
            }

            # Update our current page 
            self.current_page = self.paginate.page

            clrscr()

            self.intro()

            if preserve_message is not None:
                print("")
                print(preserve_message)
                print("")
                preserve_message = None # Reset

            if self.item_count <= 0:
                EmptyRow()

            else:
                self.current_item_length = len(self.paginate.current_data)

                if self.current_item_length == self.per_page:
                    pages_item_count = (self.paginate.page + 1) * self.current_item_length

                else:
                    pages_item_count = ((self.paginate.page) * self.per_page) + self.current_item_length

                print(f"Viewing data {pages_item_count} out of {self.item_count} items")

                items = self.paginate()

                self.current_item_length = len(items)

                self.print_data(items)

                print("")

            # Check if we can do next or previous the table
            has_prev = not self.current_page == 0 
            has_next = not ((1 + self.current_page) * self.per_page) > self.item_count

            # Input
            response = self.action(has_next, has_prev)

            # First, check if response is a 'back' value
            # Second, check if response is on selection
            # Third and last, check if response is a selected item

            if response == 'back':
                return

            if response in selection_list:
                selection_list[response]()

                # Messages can be from Insert, Modify, Delete
                if premes():
                    preserve_message = premes(True)
                continue 

            # Get the selected item
            item_index = get_num(response)

            try:
                self.on_select(items[item_index - 1])

                # Messages can be from Insert, Modify, Delete
                if premes():
                    preserve_message = premes(True)
            except BaseException as be:
                preserve_message = be

    """
    Handle selected item from
    """
    def on_select(self, item):
        # Try to fetch it from database
        # To prevent other error like
        # Already modified or deleted
        item = self.db.get(**item)

        if item == {}:
            raise Exception("Error: Item may have been deleted")

        clrscr()

        print("Item Selected")
        print("")
        ViewData(item)
        print("")

        dm = Selections("  Any action?")
        dm.insert("Modify")
        dm.insert("Delete")
        dm.insert("Back")

        response = str(dm).lower()

        match response:
            case "back":
                return

            case "modify":
                Modify(self.db, item)
                pass

            case "delete":
                Delete(self.db, item)
                pass

    """
    Handle selection from navigation
    """
    def action(self, has_next, has_prev):
        ms = MultiSelections()

        ms.validator(self.__action_selection_validator)

        ms.insert("Refresh")
        ms.insert("Insert")

        if has_next:
            ms.insert("Next")

        if has_prev:
            ms.insert("Previous")

        ms.insert("Back")

        response = str(ms)

        # Check if its a number
        try:
            # Return the item from navigation
            return ms.menus[int(response) - 1].lower()
        except:
            pass

        # Return the item from table
        return response.lower()

    def print_data(self, items):
        table = PrettyTable()
        table.field_names = ["#", "Name", "Color"]

        # text-align: center; # Hahaha
        table.align['#.'] = "c"
        table.align["Name"] = "c"
        table.align["Color"] = "c"

        for k, item in enumerate(items):
            table.add_row([get_letter(k + 1), item.get("name"), item.get("color")])

        print(table)

    def reload(self):
        self.data = self.db.get()
        self.item_count = len(self.data)
        self.paginate = Pagination(self.data, self.per_page, self.current_page)

    """
    Validate input
        it is an item from the table?
        it is an action from navigation?
    """
    def __action_selection_validator(self, max_item, value):
        """
        Return false if the input is a special characters
        Its either a number from navigation
        or an item from table.
        """
        if not re.match(r'^([0-9]+|[a-zA-Z]+)$', value):
            return False

        # Check if the value is a number
        # If a number, the user intended to do navigate
        try:
            parsed_value = int(value)

            """
            Check if the value(parsed_value) is 
            greater than 0 and less than or equal
            to max item that are currently display  
            """
            if parsed_value > 0 and parsed_value <= max_item:
                return True
        except:
            pass

        # If not a number, the user maybe selected
        #  an item from the table

        """
        How it works?
        Convert letter(s) back into numbers
        and check if the number is between
        1 and current length of items 
        that currently display  
        """
        num = get_num(value)

        if num > 0 and num <= len(self.paginate.current_data):
            return True

        return False
