#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Hosted REST API driver

"""
from model.php_api import PHP_API as phpapi_model
from os import getenv as env
import json

# Todo: Try to inherit Local_PHP_API and override the url

class Hosted_PHP_API(phpapi_model):
    
    __addr__ = env('hosted_php_api')
    
    def __init__(self):
        super().__init__()
        self.url(Hosted_PHP_API.__addr__)

    def close(self):
        pass
    
    def reopen(self):
        pass
    
    # We have fallback in databass if 
    # get_by_name does not exists
    #def get_by_name(self, name):
    #    pass
    
    def insert(self, **args):
        name = args.get("name")
        color = args.get("color")

        if None in [name, color]:
            raise Exception("Hosted_PHP_API.insert should have name and color arguments")

        try:
            # Insert data
            # Fetch all data and iterate until
            # we get the match value we currently
            # inserted and return the id
            
            # requirements
            # name, color
            
            args['mode'] = 'insert'
            
            super(Hosted_PHP_API, Hosted_PHP_API).send_data(**args)
            
            records = self.get_all()
            
            for record in records:
                
                if not record['name'].lower() == name.lower():
                    continue
                
                if not record['color'].lower() == color.lower():
                    continue
                
                return record['id']
                
            
        except BaseException as be:
            raise Exception("Request execution: Failed")

    def get(self, _id):

        if _id is None:
            raise Exception("Hosted_PHP_API.get parameter must be an id, None given")

        try:
            # Get all data and iterate until we match the id
            records = self.get_all()
            
            for record in records:
                if str(record['id']) == str(_id):
                    return record
        except:
            raise Exception("Request execution: Failed")
        
        return {}

    def get_all(self):
        # Fetch all data and return
        response = super(Hosted_PHP_API, Hosted_PHP_API).get_all()
        return json.loads(response['body'])

    def update(self, **args):
        _id = args.get("id")
        name = args.get("name")
        color = args.get("color")

        if _id is None:
            raise Exception("Hosted_PHP_API.update parameter must be an id, None given")

        if None in [_id, name, color]:
                raise Exception("Hosted_PHP_API.update should have id, name and color arguments")

        # Check if id does exist 
        if self.get(_id) == {}:
            return False

        try:
            # Do simple update 
            args['mode'] = 'modify'
            super(Hosted_PHP_API, Hosted_PHP_API).send_data(**args)
            return True

        except:
            raise Exception("Request execution: Failed")

    def delete(self, _id):

        if self.get(_id) == {}:
            return False

        try:
            # Do simple delete 
            args = {
                'mode' : 'delete',
                'id' : _id
            }
            
            super(Hosted_PHP_API, Hosted_PHP_API).send_data(**args)
            return True
        except:
            raise Exception("Request execution: Failed")
