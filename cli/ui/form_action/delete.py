#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from ui.snippets.view_data import ViewData
from utils.confirm import Confirm
from utils.helpers import clrscr, premes


class Delete:
    def __init__(self, database: Database, args):
        self.db = database
        self.__data__ = args

        clrscr()
        print("Delete mode")
        print("")
        response = self.__confirm__

        try:
            if response is True:
                # delete
                self.db.delete(**self.__data__)
                premes("Item deleted\n Refresh to take changes")
                return
        except BaseException as be:
            premes("An error occured during deletion\n  Please, try again")
            return

        premes("Transaction denied")

    @property
    def __confirm__(self):

        ViewData(self.__data__)
        print("")

        return Confirm("Are you sure to delete this item?").response
