#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from dotenv import load_dotenv
from checks import Checks
from utils.selections import Selections
from utils.helpers import clrscr
from os import getenv as env
from sys import exit
from ui.ui import UserInterface

## Load and parse .env file
load_dotenv(".env")

from utils.option_selection import OptionSelection as OptSel

class Main:
    driver_set = ""
    
    def __init__(self):
        clrscr()
        
        print(" ~ Greetings ~ ")
        print("This is the Command Line Interface\n  Created for MariaDB Sample.")
        print("")
        
        Main.driver_set = self.select_driver()
        
        print("\nDriver check: Started")
        
        Checks.driver_set = Main.driver_set
        Checks.start()
        
        # Begin
        UserInterface()
    
    def select_driver(self):
        dm = Selections("Please, select the driver you want to use")
        dm.insert("Use MariaDB module")
        dm.insert(f"Use REST API via {env('php_api_host')}")
        
        # Don't use int(dm) in condition
        # It will reask the same thing
        response = dm.response
        if response == 1:
            return "mariadb"
        
        elif response == 2:
            return "php_api"
        
        else:
            print("Driver not found")
            print("Exiting...")
            exit(0)
        


if __name__ == '__main__':
    Main()
