#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Check modules
"""

from sys import exit
from time import sleep

from utils.helpers import random_letters


class Checks:

    driver_set = ""

    def __init__(self):
        pass

    @staticmethod
    def start():
        
        print("\nDriver check: Started")

        # Check for Fatal Problems

        driver = Checks.call_driver()

        # Try to insert , get, edit and delete
        err = []
        db = driver()

        # Table Structure Check
        if hasattr(db, "structure_check"):
            if not db.structure_check():
                print("Structure Check: Failed")
                print("Error Level: Fatal")
        else:
            print("\n* Database Structure Check: Not Avaialable\n")

        sample1 = {
            "name":random_letters(),
            "color":random_letters(5)
        }
        sample2 = {
            "name":random_letters(),
            "color":random_letters(5)
        }

        id = None

        # Insertion Check
        try:
            # Expected to return the last row id
            id = db.insert(**sample1)
            id = int(id)
        except BaseException as BE:
            err.append({
                "mode":"insert",
                "error":BE
            })

        # Get Check
        try:
            # Expected to get name and color from insert
            item = db.get(id)

            if not sample1["name"] == item["name"] and not sample1["color"] == item["color"]:
                raise Exception("Check MariaDB.get method: Failed")

        except BaseException as BE:
            err.append({
                "mode":"get",
                "error":BE
            })

        # Update Check
        try:
            """
            Update item by id with new value
            Expected: MariaDB.get should return new value 
            """
            sample2["id"] = id
            db.update(**sample2)

            item = db.get(id)

            if not sample2["name"] == item["name"] and not sample2["color"] == item["color"]:
                raise Exception("Check MariaDB.update and MariaDB.get method: Failed")

        except BaseException as BE:
            err.append({
                "mode":"update",
                "error":BE
            })

        # Delete Check
        try:
            """
            Delete item by id 
            Expected: MariaDB.get item should return empty dict
            """
            all_item = db.get_all()

            if not len(all_item) > 0:
                raise Exception("Empty database. Expected atleast one item")

            item1 = db.get(id)

            db.delete(id)

            item2 = db.get(id)

            if set(item1) == set(item2):
                raise Exception("Check MariaDB.delete and MariaDB.get method: Failed")

        except BaseException as BE:
            err.append({
                "mode":"delete",
                "error":BE
            })

        # Reset to initial State
        if hasattr(db, "reset"):
            db.reset(id)

        else:
            print("Database has no reset method")

        if len(err) > 0:
            print("List of fatal problem:")
            print("")

            arr = []

            for err_item in err:
                print(f"On {err_item['mode']} method:")
                print(f"  {err_item['error']}")

            print("\n")
            print(("** == " * 6) + "**")

            print("Exiting...")
            exit(0)

        print("Status: Ready")
        #sleep(1.0)

    @staticmethod
    def call_driver():
        if Checks.driver_set == "mariadb":
            from drivers.mariadb import MariaDB
            return MariaDB

        elif Checks.driver_set == "php_api":
            from drivers.local_php_api import Local_PHP_API
            return Local_PHP_API

        elif Checks.driver_set == "hosted_php_api":
            from drivers.hosted_php_api import Hosted_PHP_API
            return Hosted_PHP_API
            
        else:
            #raise Exception("Driver not found")
            print(f"Driver not found: {Checks.driver_set}")
