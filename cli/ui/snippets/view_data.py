#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class ViewData:

    __line__ = "[" + ("===" * 10) + "]"

    def __init__(self, item):
        self.__item__ = item
        print(ViewData.__line__)

        if item.get("id"):
            print(f"ID: {self.__item__['id']}")

        print(f"  Name: {self.__item__['name']}")
        print(f"  Color: {self.__item__['color']}")

        print(ViewData.__line__)
