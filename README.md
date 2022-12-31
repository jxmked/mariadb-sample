# mariadb-sample

Using single database to sync two interfaces (Web, CLI). 

## Requirements
 
**Environments and module/libraries**

  - Atleast `Python` 3.10
  - Atleast `PHP` 8.0
  - Atleast `NodeJS` 16.18
  - Atleast `mariadb` 10.9

---

### Installation
 
 In Termux, you can execute `$ bash install.sh` to automatically install some required
 packages, modules, sub modules and library.
 
 > Note: For all new with MariaDB, you can use the link I provided from `install.bash`
 > for steps how to setup MariaDB in Termux.
 > Save your MariaDB username and password in all .env files inside of this folder
 > This will allow Python and PHP to access your database.
 > Import database and table structure from `scheme` folder.

 > If your MariaDB is not set properly, you can use option number 4 (Use JSON as Database)
 > In Python CLI but you're limited in that database which means that database is only
 > accessible for Python CLI and completely independent from other databases.   
 
 ---

## Start up and play

 1. Build web assests (js, css) files using this command `$ npm run build`
 2. Start MariaDB service by using `$ mysqld`. This will start Daemon service and create .sock file.
 3. Start new session then run host your `PHP` API and `Web` Interface using this command `$ npm run serve`
 4. You can now access `Web` interface using `http://localhost:8080/` and you API `http://localhost:8000/`

**To Start `Python` Command Line Interface (`CLI`)**

You can access it by...
 - Use `$ cd cli` then execute Python `main.py` script

 > Note: In some cases, option number 3 (Use Hosted REST API via 000Webhost) might fail randomly
 > due to a problem to my code or technical error. IDK but hopes to it work well as expected.
 
 > And you can see realtime changes [here](https://jxmked.github.io/mariadb-sample/).

 > And every user is limited upto 10 database changes such as insert, edit, delete and 
 > automatically reset in 30 minutes. But you may still get success message in after doing so (watch out for that).

---

I'll try to upload some video on how to setup this thing in Termux.

But now... Thanks... ❤

## Socials

- [Github](https://github.com/jxmked)
- [Facebook](https://www.facebook.com/deguia25)
