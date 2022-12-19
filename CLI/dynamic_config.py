#!/usr/bin/env python3
# -*- coding: utf-8 -*-


"""
Dynamic Config
"""
from os import environ

class DynamicConfig:
    
    __data__ = {}
    
    def __init__(self, num):
        pass
    
    @staticmethod 
    def get(key, fallback=None):
        return DynamicConfig.__data__.get(key, fallback)
    
    @staticmethod
    def set(key, value):
        DynamicConfig.__data__.update({f"{key}":value})
    

class ENV:
    def __init__(self):
        pass
    
    @staticmethod
    def get(key, fallback=None):
        return environ.get(key, fallback)
    
