#!/usr/bin/bash

# I create this script specially for Termux user
# and also expecting to be able to run in Linux
# or other environment that fully support this
# bash script. 
# 


# Contains basic installation of packages
# and sub packages/module or library

function is_installed() {
    echo $(dpkg-query -W -f='${Status}' ${1} 2>/dev/null | grep -c "ok installed");
}

function install_package() {
    apt-get install $1 -y;
}



# Setup python

function install_python_module() {
    python -m pip install $1;
}

if [[ $(is_installed 'python') == 0 ]]; then
    install_package 'python';
fi

# Install python dependencies 
python -m pip install -r "requirements.txt";
# done


# Setup Php

if [[ $(is_installed 'php') == 0 ]]; then 
    install_package 'php';
fi

# Done

# Install NodeJs

# Issue related to this.

# 'https://github.com/npm/cli/issues/5114#issue-1290855974'

# Solve for me
# 'https://github.com/npm/cli/issues/5114#issuecomment-1180628213'
if [[ $(is_installed 'nodejs-lts') == 0 || $(is_installed 'nodejs') == 0 ]]; then 
    # Having an issue 
    
    # This how how i solve it
    # I don't know how it works
    
    pkg install 'nodejs' -y;

    # Update NPM
    npm install -g npm@latest;
    
    pkg install 'nodejs-lts' -y;
    
    # Install dependencies
    
    npm install -g 'typescript' 'sass' 'concurrently';
    
fi

# Install MariaDB

if [[ $(is_installed 'mariadb') == 0 ]]; then
    install_package 'mariadb';
fi


echo """
    I did not know how to set up mariadb using script yet
    
    But here some steps to follow.
    
    https://linuxconfig.org/how-to-change-mariadb-user-password
    https://wiki.termux.com/wiki/MariaDB
    
    -----
    
    After installation and setup of Mariadb
    
    Set your username and password into .env files
    you found in this application
    
    Then import database structure from 'scheme' folder 
    
    and you can try if its worked. 
    
    and last one, enjoy =)
    
"""
