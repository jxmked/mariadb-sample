#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from utils.console_in import ConsoleIn
from utils.helpers import clrscr, premes
from utils.validator import Validator


class Insert:

    __line__ = "<" + ("-+" * 11) + "->"

    def __init__(self, database: Database):
        self.db = database

        clrscr()
        print("Insert mode")
        print("Use 0 to back")

        response = self.response

        if response == {}:
            # Transaction Cancelled
            premes("Transaction cancelled")
            return

        try:
            response['id'] = self.db.insert(**response)
            premes("New item inserted\n Refresh to take changes")

        except BaseException as be:
            premes("An error occured during inserting\n  Please, try again")

    """
    Our form
    """

    def get_name(self):
        while True:
            response = str(ConsoleIn("Name: ")).strip()

            if response == '0':  # Cancelled
                raise Exception("back")

            if Validator.name(response):
                if not self.__is_name_exists__(response):
                    return response
                print("Name already exists")

            print("Please, provide new valid name")
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
                "name": name,
                "color": color
            }
        except SystemExit as se:
            raise se

        except:
            pass

        return {}

    # Return true if name already exists otherwise false
    def __is_name_exists__(self, name):
        return self.db.__get_by_name__(name).get('id', None) is not None
