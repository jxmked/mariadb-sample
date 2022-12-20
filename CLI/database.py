#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from checks import Checks
from model.validator import Validator
import inspect

class Database:
    
    def __init__(self, driver_set):
        driver = Checks.call_driver()
        
        self.db = driver()
        
        self.insert(name="hakdog", color="green")
    
    def insert(self, **args):
        name = args.get("name")
        color = args.get("color")
        
        if not Validator.name(name):
            raise Exception("Invalid Name")
        
        if not Validator.name(color):
            raise Exception("Invalid Color")
            
        if hasattr(self.db, "get_by_name"):
            _id = self.db.get_by_name(name)
            
        elif hasattr(self.db, "get_all"):
            
            items = self.db.get_all()
            
            for item in items:
                if item.get('name').lower() == name.lower():
                    _id = item.get('id')
                    break
        else:
            # we should have something here
            pass
        
        print(_id)