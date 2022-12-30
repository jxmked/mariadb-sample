#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
REST API model

"""
from os import getenv as env
import requests
from sys import exit
from json import loads

class PHP_API:
    __url__ = ""
    __request_timeout__ = 5 # seconds
    
    def __init__(self):
        print("Php Api Model init")
        pass
    
    
    @staticmethod
    def url(param=None):
        # Im having a problem when using setter and getter
        # for this
        if param:
            PHP_API.__url__ = param
        return PHP_API.__url__
    
    @property
    @staticmethod
    def db_type():
        return "restapi"

    @staticmethod
    def get_param(**attr):
        _id = str(attr.get("id"))
        addr = f"{PHP_API.__url__}?id={_id}"
        
        return PHP_API.__get_requests__(addr)
    
    @staticmethod
    def get_all(**attr):
        
        addr = f"{PHP_API.__url__}"
        
        return PHP_API.__get_requests__(addr)

    @staticmethod
    def send_data(**attr):
        addr = f"{PHP_API.__url__}"
        
        return PHP_API.__send_requests__(addr, **attr)

    @staticmethod
    def __send_requests__(url, **attr):
        ret = {}
        # https://stackoverflow.com/a/16511493/11481602
        try:
            req = requests.post(
                url, 
                timeout=PHP_API.__request_timeout__,
                data=attr
            )
            
            req.raise_for_status()
            
            ret["status"] = req.status_code
            ret["body"] = req.text
        
        except requests.exceptions.Timeout as rt:
            # 408 Request Timeout
            ret["status"] = 408
            ret["body"] = rt
        
        except requests.exceptions.ConnectionError as bg:
            # 502 Bad Gateway
            
            ret["status"] = 502
            ret["body"] = bg
            
        except requests.exceptions.HTTPError as br:
            # 400 Bad Request
            
            # Possibly conflict error
            # where name already exists in database
            # or id does not exists
            # Can't figure out what kind of error to show
            
            ret["status"] = 400
            ret["body"] = br
            
        #except requests.exceptions.RequestException:
        except BaseException as be:
            print("Fatal error")
            print("")
            print(be)
            exit(0)
        
        return ret

    @staticmethod
    def __get_requests__(url):
        ret = {}
        # https://stackoverflow.com/a/16511493/11481602
        try:
            req = requests.get(
                url, 
                timeout=PHP_API.__request_timeout__
            )
            
            req.raise_for_status()
            
            ret["status"] = req.status_code
            ret["body"] = req.text

        except requests.exceptions.Timeout as rt:
            # 408 Request Timeout
            ret["status"] = 408
            ret["body"] = rt
        
        except requests.exceptions.ConnectionError as bg:
            # 502 Bad Gateway
            
            ret["status"] = 502
            ret["body"] = bg
            
        except requests.exceptions.HTTPError as br:
            # 400 Bad Request

            # Can't figure out what kind of error to show
            ret["status"] = 400
            ret["body"] = br

        #except requests.exceptions.RequestException:
        except BaseException as be:
            print("Fatal error")
            print("")
            print(be)
            exit(0)

        return ret
