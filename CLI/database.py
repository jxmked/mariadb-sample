#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from checks import Checks
from utils.validator import Validator
from utils.helpers import is_empty, flat_dict_compare

class Database:

    def __init__(self):
        driver = Checks.call_driver()
        self.__db__ = driver()

    def insert(self, **args):
        """
        It takes a dictionary of arguments, validates them, checks if the name already exists, and then
        inserts the record into the database
        :return: True
        """
        name = args.get("name")

        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE

        if self.__get_by_name__(name).get("id", None) is not None:
            raise Exception("Name already exists.")

        try:
            return self.__db__.insert(**args)

        except Exception:
            raise Exception("Insert: Failed")

    def update(self, **args):
        """
        It updates an item in the database
        :return: The return value is a boolean value.
        """
        name = args.get('name')
        _id = args.get('id')

        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE

        if not Validator.id(str(_id)):
            raise Exception("Invalid ID")

        item = self.__db__.get(_id)

        # Check if the id does exists in database
        if item == {}:
            raise Exception("Item not found")

        # Name already exists 
        if self.__get_by_name__(name).get('id') not in [None, _id]:
            raise Exception("Name already exists")

        try:
            self.__db__.update(**args)
            return True
        except:
            raise Exception("Update: Failed")

    def get(self, **args):
        """
        It returns all the records if the id is empty, otherwise it returns the record with the given id
        :return: A list of dictionaries.
        """
        _id = str(args.get('id', ""))

        if is_empty(_id):
            return self.__db__.get_all()

        if not Validator.id(_id):
            raise Exception("Invalid ID")

        return self.__db__.get(_id)

    def delete(self, **args):
        """
        It deletes an item from the database if the item exists and the data matches
        :return: The return value is a boolean value.
        """
        _id = args.get('id')

        try:
            self.__param_validate__(**args)
        except BaseException as BE:
            raise BE

        if not Validator.id(_id):
            raise Exception("Invalid ID")

        item = self.__db__.get(_id)

        if not flat_dict_compare(item, args):
            raise Exception("Data mismatched")

        try:
            self.__db__.delete(_id)
            return True
        except:
            raise Exception("Delete: Failed")

    def __param_validate__(self, **args):
        """
        It validates the parameters passed to the function
        :return: The return value is a boolean value.
        """
        if not Validator.name(args.get("name")):
            raise Exception("Invalid Name")

        if not Validator.name(args.get("color")):
            raise Exception("Invalid Color")

        return True

    def __get_by_name__(self, name):
        """
        If the database has a method called get_by_name, use it. Otherwise, if the database has a method
        called get_all, use it. Otherwise, do nothing

        :param name: The name of the item to be fetched
        :return: A dictionary with matched ID
        """
        response = {}

        if hasattr(self.__db__, "get_by_name"):
            response['id'] = self.__db__.get_by_name(name)

        elif hasattr(self.__db__, "get_all"):

            items = self.__db__.get_all()

            for item in items:
                if item.get('name').lower() == name.lower():
                    response['id'] = item.get('id', None)
                    break
        else:
            # we should have something here
            # That will fetch something in database by name
            pass

        return response
