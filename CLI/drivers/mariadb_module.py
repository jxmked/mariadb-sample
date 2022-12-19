#!/usr/bin/env python3
# -*- coding: utf-8 -*-


from os import getenv as env
from sys import exit
import mariadb


class MariaDB:
    # Secrets
    __sk_host__ = env("mariadb_host")
    __sk_port__ = env("mariadb_port")
    __sk_user__ = env("mariadb_user")
    __sk_pwd__ = env("mariadb_pwd")
    __sk_db__ = env("mariadb_db")
    __open_db__ = {}
    
    def __init__(self):
        print(MariaDB.__sk_db__)
        pass
    
    @staticmethod
    def open(db):
        try:
            conn = mariadb.connect(
                user=MariaDB.__sk_user__,
                password=MariaDB.__sk_pwd__,
                host=MariaDB.__sk_host__,
                port=MariaDB.__sk_port__,
                database=db
            )
            conn.auto_reconnect = True
        except mariadb.Error as e:
            print("Opening Database: Failed")
            print(f"User: {MariaDB.__sk_user__}")
            print(f"Database: {db}")
            exit(1)
        
    def check(self):
        # Return 0 if passed
        
        # Open Connection

        
        return 0
        
        