#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from utils.console_in import ConsoleIn
from abstract_classes.selections import Selections as AbstractSelections
from utils.helpers import ucfirst

class OptionSelection(AbstractSelections):

    def __init__(self, desc=None):
        super().__init__(desc, False)
        self.__callback_validator__ = None

    def __selections__(self):

        if self.__callback_validator__ is None:
            raise Exception("Cannot call OptionSelection.__selections__ without passing a callback function in validator method")

        maxNum = 0

        print(OptionSelection.__line__)

        if self.__desc__ is not None:
            print(self.__desc__)
            print("")

        print("Use letters to select an item and")
        print("  use numbers to make a move.")
        print("")
        print("Your choice:")

        # print selection list
        for k, item in enumerate(self.menus):

            item = (ucfirst(item) if OptionSelection.capitalize_items else item)

            print(f"{k + 1}. {item}")

            maxNum = k + 1

        print(OptionSelection.__line__)

        # Get selected item from input

        while True:
            selected = str(ConsoleIn(" >> : "))

            if self.allow_overflow or self.__callback_validator__(maxNum, selected):
                print(OptionSelection.__line__)
                return selected

    def validator(self, callback):
        self.__callback_validator__ = callback

    def __str__(self):
        return self.__selections__()

    def __int__(self):
        raise Exception("Invalid argument supplied in __init__")
