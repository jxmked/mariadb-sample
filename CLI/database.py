#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from checks import Checks


class Database:
    
    def __init__(self):
        self.db = Checks.call_driver()
        pass