#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Print Selection
"""

from abstract_classes.selections import Selections as AbstractSelections


class Selections(AbstractSelections):

    def __init__(self, desc=None, allow_overflow=False):
        super().__init__(desc, allow_overflow)

    #@override
    def __selections__(self):
        return super().__selections__()
