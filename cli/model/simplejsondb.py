#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
Using Simple Json Db module
we can do save the data into file
and treat it like a database but it json format
"""
from simplejsondb import Database
import os

    # Our id should be an integer
    # Validate the from driver before reaching
    # this database

class SimpleJSONDB:
    
    __default_path__ = "databases"
    __db_filename__ = "mariadb_sample"
    
    def __init__(self):
        filename = os.path.join(SimpleJSONDB.__default_path__, SimpleJSONDB.__db_filename__)

        self.instance = Database(filename, default=dict())

    def __get_last_row_id__(self):
        try:
            return int(sorted(self.instance.data.keys())[-1])
        except IndexError:
            return 0

    def insert_data(self, _id, **attr):
        # Our id should be an integer
        self.instance.data[str(_id)] = attr

    def get_data(self):
        return self.instance.data

    def update_data(self, **attr):
        # Validate the id if foes exists, else raise an error
        
        try:
            _id = str(attr.get("id"))
            
            if _id not in self.instance.data.keys():
                raise KeyError("Key not exists")
            
            self.instance.data[_id] = attr
            return True

        except KeyError as ke:
            raise Exception('ID does not exists')
        
        except BaseException as be:
            pass
        
        except:
            pass
        
        return False

    def delete_data(self, _id):

        try:
            if str(_id) not in self.instance.data.keys():
                raise KeyError()

            del self.instance.data[str(_id)]
            return True

        except KeyError as ke:
            raise Exception('ID does not exists')
        
        except BaseException as be:
            pass
        return False
