#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from os import getenv as env
from sys import exit
from time import sleep

from checks import Checks
from dotenv import load_dotenv
from ui.ui import UserInterface
from utils.helpers import clrscr
from utils.selections import Selections

## Load and parse .env file
load_dotenv(".env")

class Main:
    driver_set = ""

    def __init__(self):
        clrscr()

        print(" ~ Greetings ~ ")
        print("This is the Command Line Interface\n  Created for MariaDB Sample.")
        print("")

        Main.driver_set = self.select_driver()

        Checks.driver_set = Main.driver_set
        #Checks.start()
        
        print("Driver checker is currently not available")
        #sleep(1.0)
        
        driver = Checks.call_driver()
        # Begin
        
        UserInterface()

    def select_driver(self):
        dm = Selections("Please, select the driver you want to use")
        dm.insert("Use MariaDB module")
        dm.insert(f"Use REST API via {env('php_api_host')}")
        
        # If you cannot access this.
        # Your IP is probably block by their servers
        # Like mine =(
        # Use VPN instead
        dm.insert("Use Hosted REST API via 000Webhost")
        dm.insert("Use JSON as Database")
        
        # Don't use int(dm) in condition
        # It will reask the same thing
        response = dm.response
        
        if response == 1:
            return "mariadb"

        elif response == 2:
            return "php_api"
        
        elif response == 3:
            return "hosted_php_api"
        
        elif response == 4:
            return "jsondb"
        
        else:
            print("Driver not found")
            print("Exiting...")
            exit(0)

if __name__ == '__main__':
    Main()
