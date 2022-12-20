#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from checks import Checks
from model.validator import Validator
from utils.helpers import is_empty, flat_dict_compare

class Database:
    
    def __init__(self):
        driver = Checks.call_driver()
        self.db = driver()
        
    def insert(self, **args):
        name = args.get("name")
        
        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE
            
        if not self.__get_by_name__(name) == {}:
            raise Exception("Name already exists.")
        
        try:
            self.db.insert(**args)
            return True

        except Exception:
            raise Exception("Insert: Failed")

    def update(self, **args):
        name = args.get('name')
        _id = args.get('id')

        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE
        
        if not Validator.id(_id):
            raise Exception("Invalid ID")
        
        item = self.db.get(_id)

        # Check if the id does exists in database
        if item == {}:
            raise Exception("Item not found")
        
        # Name already exists 
        if str(self.__get_by_name__(name)) not in [_id, str({})]:
            raise Exception("Name already exists")
        
        try:
            self.db.update(**args)
            return True
        except:
            raise Exception("Update: Failed")
    
    def get(self, **args):
        _id = args.get('id')
        
        if is_empty(_id):
            return self.db.get_all()

        if not Validator.id(_id):
            raise Exception("Invalid ID")
        
        return self.db.get(_id)
    
    def delete(self, **args):
        _id = args.get('id')

        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE
        
        if not Validator.id(_id):
            raise Exception("Invalid ID")
        
        item = self.db.get(_id)

        if not flat_dict_compare(item, args):
            raise Exception("Data mismatched")
        
        try:
            self.db.delete(_id)
            return True
        except:
            raise Exception("Delete: Failed")


    def __param_validate__(self, **args):
        if not Validator.name(args.get("name")):
            raise Exception("Invalid Name")
        
        if not Validator.name(args.get("color")):
            raise Exception("Invalid Color")
        
        return True

    def __get_by_name__(self, name):
        _id = None

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
            # That will fetch something in database by name
            pass
        
        return _id
