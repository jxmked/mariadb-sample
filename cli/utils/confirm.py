#!/usr/bin/env python3
# -*- coding: utf-8 -*-

from utils.console_in import ConsoleIn

class Confirm:
    __line__ = ("*~" * 20) + "*"

    def __init__(self, msg, strict=False):
        self.__msg__ = msg
        self.__strict__ = strict

    @property
    def __get_input__(self):
        while True:
            response = str(ConsoleIn("Confirm [Y/n]: ")).strip().lower()

            if self.__strict__ and len(response) > 1:
                continue

            if response.startswith("y"):
                print(Confirm.__line__)
                return True

            if response.startswith("n"):
                print(Confirm.__line__)
                return False

    @property
    def response(self):
        return self.__call__()

    def __call__(self):
        print(Confirm.__line__)
        print(self.__msg__)
        return self.__get_input__
