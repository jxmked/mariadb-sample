#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
Remove Error throws by ctrl + c
Replace it with better message than error message
"""

"""
Use built-in `str`, `int`, and `float` to parse the output

"""

from sys import exit

class ConsoleIn:

    def __init__(self, label=None):
        self.__label__ = (label if label is not None else "")

    @staticmethod
    def input(label):

        try:
            return input(label)

        except KeyboardInterrupt:
            print("\n\n")
            print("Program Terminated")
            print("Exit.")
            exit(0)

        except:
            pass

        return None

    def __str__(self):
        # Return string if parsed by str() function
        return ConsoleIn.input(self.__label__)

    def __int__(self):
        # Return Integer if parsed by int() function

        while True:

            try:
                return int(self.__str__())
            except ValueError:
                pass

    def __float__(self):
        # Return float if parsed by float() function

        while True:
            try:
                return float(self.__str__())
            except ValueError:
                pass

    def __call__(self):
        return self.__str__()
