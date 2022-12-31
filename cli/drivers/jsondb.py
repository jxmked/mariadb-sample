#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from os import getenv as env
from model.simplejsondb import SimpleJSONDB

class JSONDB:
    
    def __init__(self):
        self.__db__ = SimpleJSONDB()
        
    def close(self):
        pass
    
    def reopen(self):
        pass
    
    def insert(self, **args):
        name = args.get("name")
        color = args.get("color")

        if None in [name, color]:
            raise Exception("JSONDB.insert should have name and color arguments")

        try:
            # Insert data
            # Fetch all data and iterate until
            # we get the match value we currently
            # inserted and return the id
            
            # requirements
            # name, color
            
            lri = self.__db__.__get_last_row_id__()
            
            args['id'] = lri + 1
            
            self.__db__.insert_data(lri + 1, **args)
            
            records = self.get_all()
            
            for record in records:
                
                if not record['name'].lower() == name.lower():
                    continue
                
                if not record['color'].lower() == color.lower():
                    continue
                
                return record['id']
                
            
        except BaseException as be:
            raise Exception("Write execution: Failed")

    def get(self, _id):

        if _id is None:
            raise Exception("JSONDB.get parameter must be an id, None given")

        try:
            # Get all data and iterate until we match the id
            records = self.get_all()
            
            for record in records:
                if str(record['id']) == str(_id):
                    return record
        except:
            raise Exception("Read execution: Failed")
        
        return {}

    def get_all(self):
        return list(self.__db__.get_data().values())

    def update(self, **args):
        _id = args.get("id")
        name = args.get("name")
        color = args.get("color")

        if None in [_id, name, color]:
                raise Exception("JSONDB.update should have id, name and color arguments")

        # Check if id does exist 
        if self.get(_id) == {}:
            return False

        try:
            # Do simple update 
            self.__db__.update_data(**args)
            return True
        except BaseException as be: 
            pass
        
        raise Exception("Modify execution: Failed")

    def delete(self, _id):

        if self.get(_id) == {}:
            return False

        try:
            # Do simple delete 
            self.__db__.delete_data(_id)
            return True
        except:
            raise Exception("Trim execution: Failed")
        return False