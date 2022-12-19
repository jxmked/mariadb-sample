#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dotenv import load_dotenv
from checks import Checks
from utils.selections import Selections
from dynamic_config import ENV as env
from utils.helpers import clrscr


## Load and parse .env file
load_dotenv(".env")



class Main:
    driver_set = ""
    
    def __init__(self):
        clrscr()
        
        print(" ~ Greetings ~ ")
        print("This is the Command Line Interface Created for MariaDB Sample.")
        print("")
        
        Main.driver_set = self.select_driver()
        Checks.driver_set = Main.driver_set
        Checks.start()
        
    
    
    def select_driver(self):
        dm = Selections("Please, select the driver you want to use")
        dm.insert("Use MariaDB module")
        dm.insert("Use PHP API via localhost")
        
        # Don't use int(dm) in condition
        # It will reask the same thing
        response = int(dm)
        
        if response == 1:
            return "mariadb_module"
        
        elif response == 2:
            return "php_api"
        
        


if __name__ == '__main__':
    Main()
