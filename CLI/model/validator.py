#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""


"""


import re
from utils.helpers import is_empty

class Validator:
    
    __regexp_name__ = r'^[^\s]([a-zA-Z ]{2,64})$'
    __regexp_id__ = r'^\d$'
    
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
        