#!/usr/bin/env python3
# -*- coding: utf-8 -*-

class Pagination:
    
    def __init__(self, data, count, cur_page=0):
        self.__data__ = data
        self.__current_page__ = cur_page
        self.__count__ = count
    
    def next(self):
        self.__current_page__ += 1
    
    def prev(self):
        self.__current_page__ -= 1
    
    @property
    def page(self):
        return self.__current_page__
        
    def __call__(self):
        count = self.__count__
        cur_page = self.__current_page__
        
        f = count * cur_page
        t = count * (cur_page + 1)
        
        try:
            return self.__data__[f:t:]
        except:
            pass
        
        return []

