#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Print Selection
"""

from abc import ABC, abstractmethod

from utils.console_in import ConsoleIn
from utils.helpers import ucfirst


class Selections(ABC):

    __line__ = ("*~" * 20) + "*"
    capitalize_items = True

    def __init__(self, desc=None, allow_overflow=False):
        self.menus = []
        self.__desc__ = (None if desc is None else desc)
        self.allow_overflow = allow_overflow

    def insert(self, item):
        self.menus.append(item)

    # Getter and setter
    @property
    def line(self):
        return Selections.__line__

    @line.setter
    def line(self, new_line):
        Selections.__line__ = new_line

    def sort(self):
        # https://stackoverflow.com/a/36156/11481602
        self.menus.sort(key=str.lower)

    @abstractmethod
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
            if self.allow_overflow or (selected > 0 and selected <= maxNum):
                print(Selections.__line__)
                return selected

    def __str__(self):
        response = self.__selections__()

        if self.allow_overflow:
            return response

        return self.menus[response - 1]

    def __int__(self):
        return self.__selections__()

    @property
    def response(self):
        return self.__int__()
