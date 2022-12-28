#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Local REST API driver

"""
from os import getenv as env

class PHP_API:
    
    
    __addr__ = env('php_api_host')
    
    
    def __init__(self):
        
        pass
    
    @property
    @staticmethod
    def db_type():
        return "restapi"
        
