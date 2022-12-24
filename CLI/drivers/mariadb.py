#!/usr/bin/env python3
# -*- coding: utf-8 -*-

"""
CRUD

Handle how our System will comunicate with MariaDB Model

This driver extends our MariaDB model
"""

from model.mariadb import MariaDB as mdb_model


class MariaDB(mdb_model):

    def __init__(self):
        super().__init__()
        self.__table__ = 'fav_cats'
        self.cursor = super().open()

    def close(self):
        super().close()

    def reopen(self):
        self.cursor = super().open()

    def get_by_name(self, name):
        self.cursor.execute(f"SELECT id FROM {self.__table__} WHERE `name`=?", (name,))
        self.commit()

        for (_id,) in self.cursor:
            return _id

        return None

    def insert(self, **args):
        name = args.get("name")
        color = args.get("color")

        if None in [name, color]:
            raise Exception("MariaDB.insert should have name and color arguments")

        try:
            self.cursor.execute(f"INSERT INTO `{self.__table__}` (`name`, `color`) VALUES (?, ?)", (name, color))
            self.commit()
            return self.cursor.lastrowid
        except:
            raise Exception("Query execution: Failed")

    def get(self, _id):

        if _id is None:
            raise Exception("MariaDB.get parameter must be an id, None given")

        try:
            self.cursor.execute(f"SELECT id, name, color FROM `{self.__table__}` WHERE id=?", (_id,))
            self.commit()

        except:
            raise Exception("Query execution: Failed")

        # Always return the first item
        for (_id_, name, color) in self.cursor:
            return {
                "id":_id_,
                "name":name,
                "color":color
            }

        return {}

    def get_all(self):

        self.cursor.execute(f"SELECT id, name, color FROM `{self.__table__}`")
        self.commit()

        arr = []

        for (_id, name, color) in self.cursor:
            arr.append({
                "id":_id,
                "name":name,
                "color":color,
            })

        return arr

    def update(self, **args):
        _id = args.get("id")
        name = args.get("name")
        color = args.get("color")

        if _id is None:
            raise Exception("MariaDB.update parameter must be an id, None given")

        if None in [_id, name, color]:
                raise Exception("MariaDB.update should have id, name and color arguments")

        # Check if id does exist 
        if self.get(_id) == {}:
            return False

        try:
            self.cursor.execute(f"UPDATE `{self.__table__}` SET `name`=?, `color`=? WHERE `id` = ?", (name, color, _id))
            self.commit()
            return True

        except:
            raise Exception("Query execution: Failed")

    def delete(self, _id):

        if self.get(_id) == {}:
            return False

        try:
            self.cursor.execute(f"DELETE FROM `{self.__table__}` WHERE `id` = ?", (_id,))
            self.commit()
            return True
        except:
            raise Exception("Query execution: Failed")

    def reset(self, _id):
        # Revert ID
        self.cursor.execute(f"ALTER TABLE `{self.__table__}` MODIFY `id` bigint(20) UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=?", (_id,))

    def structure_check(self):
        """
        Structure Check 
        """
        structure = [
            ('id', 'bigint(20) unsigned', 'NO', 'PRI', None, 'auto_increment'),
            ('name', 'varchar(64)', 'YES', 'UNI', None, ''),
            ('color', 'varchar(64)', 'NO', '', None, ''),
            ('last_modified', 'timestamp', 'NO', '', 'current_timestamp()', '')
        ]

        self.cursor.execute(f"DESCRIBE `{self.__table__}`")
        self.commit()

        tab_structure = list(self.cursor)
        success_count = 0

        for x in structure:
            x = set(x)
            for y in tab_structure:
                if x == set(y):
                    success_count += 1
                    break

        return (True if success_count == len(structure) else False)
