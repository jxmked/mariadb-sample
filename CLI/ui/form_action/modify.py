#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from ui.snippets.view_data import ViewData
from utils.console_in import ConsoleIn
from utils.helpers import clrscr, premes
from utils.validator import Validator


class Modify:

    __line__ = "<" + ("-+" * 11) + "->"

    def __init__(self, database:Database, args):
        self.db = database
        self.data = args

        clrscr()

        print("Modify mode")
        print("Use 0 to back")
        print("")

        ViewData(self.data)

        print("")

        response = self.response

        if response == {}:
            # Transaction Cancelled
            premes("Transaction cancelled")
            return 

        try:
            response['id'] = self.data.get('id')

            self.db.update(**response)

            premes("Item updated\n Refresh to take changes")

        except BaseException as be:
            raise Exception("An error occured during updating\n  Please, try again")

    """
    Our form
    """
    def get_name(self):
        while True:
            response = str(ConsoleIn("Name: ")).strip()

            if response == '0': # Cancelled
                raise Exception("Transaction cancelled")

            if Validator.name(response):
                if not self.__is_name_exists__(response, self.data.get('id')):
                    return response
                print("Name already exists")

            print("Please, provide valid name")
            print("")

    def get_color(self):
        while True:
            response = str(ConsoleIn("Color: ")).strip()

            if Validator.name(response):
                return response

            print("Please, provide a valid color")
            print("")

    @property
    def response(self):
        print(self.__line__)

        try:
            name = Validator.clean(self.get_name())

            print(self.__line__)

            color = Validator.clean(self.get_color())

            print(self.__line__)

            return {
                "name":name,
                "color":color
            }
        except SystemExit as se:
            raise se

        except BaseException as be:
            raise be
            pass

        return {}

    # Return true if name already exists otherwise false
    def __is_name_exists__(self, name, _id):
        response = self.db.__get_by_name__(name)

        if response.get('id', None) in [_id, None]:
            return False

        return True
