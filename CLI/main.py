#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from checks import Checks
from utils.selections import Selections
from dynamic_config import DynamicConfig as DC
from utils.helpers import clrscr

class Main:
    
    def __init__(self):
        clrscr()
        
        print(" ~ Greetings ~ ")
        print("This is the Command Line Interface Created for MariaDB Sample.")
        print("")
        
        self.intro()
        chk = Checks()
        chk.start()
        
    
    
    def intro(self):
        dm = Selections("Please, select the driver you want to use")
        dm.insert("Use MariaDB module")
        dm.insert("Use PHP API via localhost")
        
        # Don't use int(dm) in condition
        # It will reask the same thing
        response = int(dm)
        
        if response == 1:
            DC.set("driver", "mariadb_module")
        
        elif response == 2:
            DC.set("driver", "php_api")
        
        


if __name__ == '__main__':
    Main()
