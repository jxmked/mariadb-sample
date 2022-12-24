#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from database import Database
from ui.snippets.view_data import ViewData
from utils.console_in import ConsoleIn
from utils.helpers import clrscr, premes
from utils.validator import Validator


class Delete:




    def __init__(self, db:Database, _id) -> None:
        self.db = db
        pass
