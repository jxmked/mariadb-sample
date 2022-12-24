#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from utils.validator import Validator
from utils.console_in import ConsoleIn

class InsertForm:
    
    __line__ = "<" + ("-+" * 11) + "->"
    
    def __init__(self, name_duplicated_callback):
        print("Insert new data")
        print("Use 0 to back")
        
        self.__cb_name = name_duplicated_callback
    def get_name(self):
        while True:
            response = str(ConsoleIn("Name: ")).strip()
            
            if response == '0':
                raise Exception("back")
                
            if Validator.name(response):
                
                if self.__cb_name(response):
                    return response
                
                print("Name already exists")
            
            print("Please, provide a new valid name")
            print("")
            
    def get_color(self):
        while True:
            response = str(ConsoleIn("Color: ")).strip()
            
            if Validator.name(response):
                return response
            
            print("Please, provide a valid color")
            print("")
            
    @property
    def response(self):
        print(self.__line__)
        
        try:
            name = Validator.clean(self.get_name())
        
            print(self.__line__)
            
            color = Validator.clean(self.get_color())
            
            print(self.__line__)
            
            return {
                "name":name,
                "color":color
            }
        except SystemExit as se:
            raise se
            
        except:
            pass
        
        return {}
        
