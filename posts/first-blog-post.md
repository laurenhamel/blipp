---
title: This is My First Official Blog Post
description: This is a short description about this blog post.
feature: //source.unsplash.com/random
author: Lauren Hamel
date-created: 11/06/2017 12:00PM
date-modified: 11/07/2017 1:00AM
category: Web Development
tags: [blog, web design, web development, markdown]
---

# Setting Up `localhost` on Mac

## Instructions

1. Open a console window and edit the `httpd.conf` file on your system.

    - Enter `sudo nano /etc/apache2/httpd.conf` in the console.
    - Use `CONTROL+W` to find the following lines, and uncomment them to enable the Apache server.
    
      ```apache
      #LoadModule userdir_module libexec/apache2/mod_userdir.so 
      #LoadModule include_module libexec/apache2/mod_include.so 
      #LoadModule php5_module libexec/apache2/libphp5.so 
      #LoadModule rewrite_module libexec/apache2/mod_rewrite.so 
      #LoadModule authz_host_module libexec/apache2/mod_authz_host.so 
      #LoadModule authz_core_module libexec/apache2/mod_authz_core.so 
      #LoadModule vhost_alias_module libexec/apache2/mod_vhost_alias.so 
      #Include /private/etc/apache2/extra/httpd-userdir.conf 
      #Include /private/etc/apache2/extra/http-vhosts.conf 
      ```
      
    - Find and uncomment the following lines to enable server-side includes (SSI). 
      
      ```apache
      #AddType text/html .shtml 
      #AddOutputFilter INCLUDES .shtml 
      ```
      
      > Optionally, you can also add `.shtm`, `.html`, and/or `.htm` to the end of these lines, separated with spaces, to also enable SSI parsing on any those file types.
      
    - Exit using `CONTROL+X`, then type `Y` to save your changes to `httpd.conf`.
  
  
2. Edit the `httpd-userdir.conf` file on your system.

    - Enter `sudo nano /etc/apache2/extra/httpd-userdir.conf` in the console.
    - Find and uncomment the following lines to enable user-specific configurations.
      
      ```apache
      #Include /private/etc/apache2/users/*.conf
      ```
      
    - Exit and save your changes as before.
  
  
3. Edit the configuration file for your user account `<username>.conf`.

	  - Enter `sudo nano /etc/apache2/users/<username>.conf` in the console.
    - Insert or edit the file to contain the following:
      
      ```apache
      <Directory "/Users/<username>/Sites/">
          AllowOverride All 
          Options Indexes MultiViews FollowSymLinks Includes 
          Require all granted 
          AddType text/html .shtml[ .shtm] 
          AddOutputFilter INCLUDES .shtml[ .shtm .html .htm] 
      </Directory> 
      ```
      
      > Notice how the directory root was set to `/Users/<username>/Sites/` in the above example, where `<username>` should be replaced with your user account name. This is the recommended root location for `localhost`.
        
    - Exit and save your changes as before.


4. Start the Apache server, or restart it if it's currently running.

    - Enter `sudo apachectl start` in the console to start the server.
    - Alternatively, use `sudo apachectl restart` to restart the server if it's currently running.
    - Enter the password for your user account if prompted.


5. Edit your `hosts` file to permit `localhost` to be accessed from the browser.

    - Enter `sudo nano /etc/hosts` in the console.
    - Add the following lines to the `hosts` file if they do not already exist.
      
      ```apache
      127.0.0.1   localhost
      ::1         localhost
      ```
      
    - Exit and save any changes as before.
    - If changes were made to the `hosts` file, flush the DNS cache by entering `sudo nano killall -HUP mDNSResponder` in the console.
    