#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""

"""

import re

from utils.helpers import is_empty


class Validator:

    __regexp_name__ = r"^[a-zA-Z]+( [a-zA-Z]+)*$"
    __regexp_id__ = r'^\d{1,3}$'
    __regexp_letters__ = r'^[a-zA-Z]+$'

    def __init__(self):
        pass

    @staticmethod
    def name(param):
        # Return true if good
        # Nah if bad
        if is_empty(param):
            return False

        if not re.match(Validator.__regexp_name__, param):
            return False

        # I still manage to bypass my regex
        # if not re.match(Validator.__regexp_letters__, param):
        #     return False

        return True

    @staticmethod
    def id(param):
        # Return true if good
        # Nah if bad
        if is_empty(param):
            return False

        if not re.match(Validator.__regexp_id__, param):
            return False

        return True

    @staticmethod
    def clean(param):
        # Remove extra spaces
        return re.sub(r"\s+", " ", param)
