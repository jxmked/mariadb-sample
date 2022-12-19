#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Check modules

Check MariaDB module
    Check Database Structure
    Must have
      - `fav_cats` table and must have these columns
        - id
        - name
        - color
        - last_modified

"""
from dynamic_config import DynamicConfig

class Checks:
    
    driver_set = ""
    
    def __init__(self):
        pass
    
    
    @staticmethod
    def start():
        Checks.call_driver()
        pass
    
    @staticmethod
    def call_driver():
        if Checks.driver_set == "mariadb_module":
            from drivers.mariadb_module import MariaDB
            
            MariaDB()
        pass
        

