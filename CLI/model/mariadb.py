#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Handle how our database will work 
"""

from os import getenv as env
from sys import exit
import mariadb
from atexit import register

# We have namespace in python :)
# namespace model.mariadb

class MariaDB:

    __config__ = {
        "host":env('mariadb_host'),
        "port":int(env('mariadb_port')),
        "user":str(env('mariadb_user')),
        "password":str(env('mariadb_pwd')),
        "database":str(env('mariadb_db')),
        "ssl": True
    }

    __conn__ = None

    def __init__(self):
        pass

    @property
    @staticmethod
    def db_type():
        return "sql"

    @staticmethod
    def open():

        # Whenever we open
        # Just close anything
        register(MariaDB.close)

        if  MariaDB.__conn__ is not None and not MariaDB.__conn__._closed:
            return MariaDB.__conn__.cursor()

        try:
            MariaDB.__conn__ = mariadb.connect(**MariaDB.__config__)
            MariaDB.__conn__.auto_reconnect = True
            return MariaDB.__conn__.cursor()

        except mariadb.Error as e:
            print("\n\n")
            print("Opening Database: Failed")
            print(f"Addr: {MariaDB.__config__.get('host')}:{MariaDB.__config__.get('port')}")
            print(f"User: {MariaDB.__config__.get('user')}")
            print(f"Database: {MariaDB.__config__.get('database')}")
            print("Exiting...")
            print("")
            exit(0)

        except mariadb.OperationalError:
            print("\n\n")
            print("No database service are available")
            print(f"Addr: {MariaDB.__config__.get('host')}:{MariaDB.__config__.get('port')}")
            print(f"User: {MariaDB.__config__.get('user')}")
            print("Exiting...")
            print("")
            exit(0)

    @staticmethod
    def close():
        try:
            if not MariaDB.__conn__._closed:
                MariaDB.__conn__.close()
        except:
            pass

    @staticmethod
    def execute(*args):
        MariaDB.__conn__.cursor().execute(*args)

    @staticmethod
    def commit():
        MariaDB.__conn__.commit()

    @staticmethod
    def rollback():
        MariaDB.__conn__.rollback()
