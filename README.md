# Social Spending

An application to easily manage and track split expenses between a group of friends.

## i. Overview

This system has several main components that need to be set up:

1. [MariaDB](#1-setting-up-the-database). Use the provided `database.sql` file to populate the database and add a user with which Apache can authenticate.
2. [Apache2](#2-configure-apache). Apache must be configured to provide environment variables to the PHP scripts. This section also outlines pulling code from the online repository. This sections includes steps for XAMPP installations or stand-alone Apache2 installations.
3. [Node.js/React](#3-nodejs-and-react). The front-end uses the React framework, and must be built into a javascript bundle.
4. [Executables](#4-executables). The system implements some algorithms in C++, which need to be compiled.
5. [AWS SES](#5-aws-ses). The system uses AWS SES to send emails.
6. [(Optional) Github Webhooks](#6-optional-github-webhooks). Automatically pull changes pushed to your repository and trigger a re-build of the React bundle and executables.

The following instructions detail how to install the system on a Linux machine. Although installation instructions on Windows will vary, the ideas are the same.

## ii. Dependencies

* XAMPP v8.2.4 OR (Apache2 AND PHP 8.2.4 AND MariaDB 5.4.28 AND OpenSSL 1.1.1t AND phpMyAdmin 5.2.1)
* Node.js v14 or higher
* React
* g++
* make

## 1. Setting up the Database

Once all your servers have been started, go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/), substituting 'localhost' for the address of your server.

### 1.1. Create Database and Tables

Create a new database named `social_spending`.
Afterwards, on the top navigation bar click `Import` then browse your computer for the `database.sql` file.

### 1.2. Add Credentialed User

Next, in the top left of your screen, click the house icon. On the top bar, click the `User Accounts` button.
Click `Add user account`, then fill out the `User name` and `Password` fields as desired.
You may leave the other fields as-is.

After creating the user, go back to `User accounts` and click on the user you just created.
Check the box next to `Global Privileges` then click `Go`.
The user account is now set up to access and manipulate databases.

Alternatively, use the following SQL to create the user, replacing `<username>` and `<password>` with values of your choosing:
```sql
CREATE USER '<username>'@'localhost' IDENTIFIED BY '<password>';
GRANT INSERT, UPDATE, DELETE, SELECT ON social_spending.* TO '<username>'@'localhost';
```

### 1.3. Update Apache Configuration with MariaDB User

Finally, update your Apache configuration to provide the MariaDB credentials in environment variables. For XAMPP installations, see [2.1.2. Setup Apache Config for XAMPP](#212-setup-apache-config-for-xampp), for stand-alone Apache2 installations, see [2.2.3 Apache2 Configuration for Standalone Server](#223-setup-environment-variables-in-apache).

To see how to access the database from a PHP script, refer to `templates/connection.php`.

## 2. Configure Apache

Follow steps in Section 2.1 OR 2.2, depending on if you installed XAMPP or standalone Apache2 respectively.

### 2.1. Install XAMPP for Linux

Follow these instructions to install and configure XAMPP for Linux only if you do not have a standalone installation.

Install XAMPP v8.2.4 for Linux. You may follow the instructions here: [https://itsfoss.com/install-xampp-ubuntu/](https://itsfoss.com/install-xampp-ubuntu/)

On Ubuntu, XAMPP files are placed in `/opt/lampp/`.

#### 2.1.1. Setup htdocs for XAMPP

Change the permissions of the `htdocs` directory, inside which this repository will be cloned.

_Note: Be very careful when entering the directory! Incorrectly modifying the permissions of other components in the `/opt/lampp` directory may break your installation!_

``` bash
sudo chmod -R a+rwx /opt/lampp/htdocs
```

Clone the repository into the `htdocs` directory:

```bash
cd /opt/lampp/htdocs
git clone git@github.com:Social-Spending/socialspending.git .
```

If you get an error during cloning, you may need to run the following command

```bash
git config --global --add safe.directory /opt/lampp/htdocs/
```

From the XAMPP GUI, under the 'Manage Servers' tab, select the 'Start All' button.

#### 2.1.2. Setup Apache Config for XAMPP

The following section is for Apache installations provided by XAMPP.

Edit the file `/opt/lampp/etc/httpd.conf`.
At the very end of the file, insert the following code

```
SetEnv DB_USER "<DB_USERNAME>"
SetEnv DB_PASS "<DB_PASSWORD>"
SetEnv DB "social_spending"
SetEnv SES_ACCESS_KEY "<SES_ACCESS_KEY>"
SetEnv SES_SECRET_KEY "<SES_SHARED_SECRET>"
```

Replace `<DB_USERNAME>`, `<DB_PASSWORD>`, and `example.com` with your database credentials and domain name (See [1.2. Add Credentialed User](#12-add-credentialed-user)).

Replace `<SES_ACCESS_KEY>` and `<SES_SHARED_SECRET>` with your credentials from setting up AWS SES (See [5.1. Create an Account with AWS SES](#51-create-an-account-with-aws-ses)).

After saving your changes, you must restart Apache.

### 2.2. Apache2 Configuration for Standalone Server

#### 2.2.1. Get Certificate from LetsEncrypt

This is an advanced feature, so you are expected to follow the instructions [here](https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-20-04).

The result should be
1. an Apache2 config file at `/etc/letsencrypt/options-ssl-apache.conf`
2. a certificate file at `/etc/letsencrypt/live/<DOMAIN_NAME>/fullchain.pem`
3. a private key file at `/etc/letsencrypt/live/<DOMAIN_NAME>/privkey.pem`

#### 2.2.2. Edit Apache2 Config File for Standalone Server

The following configurations are only for standalone Apache2 installations, not those provided by XAMPP.

Edit the sites-available and sites-enabled configs in /etc/apache2/sites-available

```bash
# disable default config
sudo rm /etc/apache2/sites-enabled/000-default.conf
# create file for new config in sites-available
sudo touch /etc/apache2/sites-available/socialspending.conf
# enable the new config by adding a symbolic link in sites-enabled
sudo ln -s /etc/apache2/sites-available/socialspending.conf /etc/apache2/sites-enabled/socialspending.conf
```

Add the following lines to `/etc/apache2/sites-available/socialspending.conf`:

**If using HTTPS**:

```
# production environment
<VirtualHost *:80>
	ServerName <DOMAIN_NAME>
	ServerAlias www.<DOMAIN_NAME>
	DocumentRoot /var/www/html
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined

	RewriteEngine on
	RewriteCond %{SERVER_NAME} =<DOMAIN_NAME> [OR]
	RewriteCond %{SERVER_NAME} =www.<DOMAIN_NAME>
	RewriteRule ^ https://%{SERVER_NAME}%{REQUEST_URI} [NE,R=permanent]
</VirtualHost>

<IfModule mod_ssl.c>
<VirtualHost *:443>
	ServerName <DOMAIN_NAME>
	ServerAlias www.<DOMAIN_NAME>
	DocumentRoot /var/www/html

	SSLEngine on

	ErrorLog	${APACHE_LOG_DIR}/error.log
	CustomLog	${APACHE_LOG_DIR}/access.log combined
	Include	/etc/letsencrypt/options-ssl-apache.conf
	SSLCertificateFile /etc/letsencrypt/live/<DOMAIN_NAME>/fullchain.pem
	SSLCertificateKeyFile /etc/letsencrypt/live/<DOMAIN_NAME>/privkey.pem

	Header always set Strict-Transport-Securty "max-age=63072000; include Subdomains;"
</VirtualHost>
</IfModule>
```

**If using HTTP (not HTTPS)**:

```
# production environment
<VirtualHost *:80>
	ServerName <DOMAIN_NAME>
	ServerAlias www.<DOMAIN_NAME>
	DocumentRoot /var/www/html
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Replace `<DOMAIN_NAME>` in the above text with your domain name, ie. `example.com`.

#### 2.2.3. Setup Environment Variables in Apache

Setup environment variables in `/etc/apache2/envvars`:

```
export APACHE_RUN_USER=<APACHE USER>
export APACHE_RUN_GROUP=<APACHE GROUP>

<LINES OMITTED>

export DB_USER="<DB_USERNAME>"
export DB_PASS="<DB_PASSWORD>"
export DB="social_spending"

# secret for authenticating that a webhook request actually came from github
# this is optional
export GITHUB_WEBHOOK_SECRET=<GITHUB_WEBHOOK_SECRET>

export SES_ACCESS_KEY="<SES_ACCESS_KEY>"
export SES_SECRET_KEY="<SES_SHARED_SECRET>"

export DOMAIN_NAME=example.com
```

Replace `<DB_USERNAME>`, `<DB_PASSWORD>`, and `example.com` with your database credentials and domain name (See [1.2. Add Credentialed User](#12-add-credentialed-user)).

Replace `<APACHE USER>` and `<APACHE GROUP>` with the user and group of the user used to setup the config.

Replace `<SES_ACCESS_KEY>` and `<SES_SHARED_SECRET>` with your credentials from setting up AWS SES (See [5.1. Create an Account with AWS SES](#51-create-an-account-with-aws-ses)).

Replace `<GITHUB_WEBHOOK_SECRET>` with the shared secret for your Github Webhook, if you set that up (See [6. (Optional) Github Webhooks](#6-optional-github-webhooks)).

#### 2.2.4 Setting up Repositories for Standalone Server

Create the new folder:

```sh
# create new folder, if it doesn't exist
sudo mkdir -p /var/www/html
# update permissions
sudo chown USER:GROUP -R /var/www/html
# remove existing contents
rm -rf /var/www/html/* /var/www/html/.*
```

Replacing `USER:GROUP` with the current user and group used for configuration. This should match the `APACHE_RUN_USER` and `APACHE_RUN_GROUP` in `/etc/apache2/envvars`.

In the `/var/www/html` directory
1. Clone the repository using `git clone https://github.com/Social-Spending/socialspending.git -b main`
2. Setup the upstream branch using `git remote set-branches origin main`

You must then run the initial build steps described in sections [3. Node.js and React](#3-nodejs-and-react) and [4. Executables](#4-executables).

## 3. Node.js and React

For more information about this component, see the [react_source README](./react_source/README.md).

### 3.1. Install Node.js

Install Node.js using the [NodeSource Installer](https://github.com/nodesource/distributions).

### 3.1 Install Packages

Inside the `react_source` directory, run `npm install`:

```bash
cd <PATH_TO_REPOSITORY>/react_source/
npm install
```

If running on a XAMPP installation, `<PATH_TO_REPOSITORY>` will be `/opt/lampp/htdocs`.

If running on a stand-along Apache2 installation, `<PATH_TO_REPOSITORY>` will be `/var/www/html`.

If you receive an error where npm cannot be found on a standalone installation, see [Section 3.3. NPM Setup for Standalone Server](#33-npm-setup-for-standalone-server).

### 3.2. Build JS Bundle

Inside the `react_source` directory, run the `compile.sh` script:

```bash
cd <PATH_TO_REPOSITORY>/react_source/
./compile.sh
```

If running on a XAMPP installation, `<PATH_TO_REPOSITORY>` will be `/opt/lampp/htdocs`.

If running on a stand-along Apache2 installation, `<PATH_TO_REPOSITORY>` will be `/var/www/html`.

If you receive an error on a standalone installation where npm cannot be found, see [Section 3.3. NPM Setup for Standalone Server](#33-npm-setup-for-standalone-server).

### 3.3. NPM Setup for Standalone Server

These instructions are only if you are running a standalone server.

If NPM is not already installed globally (to check, run `whereis npx`), add symbolic links in `/usr/local/bin/`:

```sh
sudo ln -s NPM_PATH /usr/local/bin/npm
sudo ln -s NPX_PATH /usr/local/bin/npx
sudo ln -s NODE_PATH /usr/local/bin/node
```

Replace `NPM_PATH` with the result of `whereis npm`, replace `NPX_PATH` with the result of `whereis npx`, and replace `NODE_PATH` with the result of `whereis node`.

## 4. Executables

The system implements some algorithms in C++. These are located in the `executables` directory.
For more information about this component, see the [executables README](./executables/README.md).

### 4.1. Update C++ Standard Library for XAMPP

These instructions are only if you are running the server on XAMPP

The C++ standard library included with XAMPP was outdated, I linked to the system's copy of `libstdc++.so.6` located in `/usr/lib/x86_64-linux-gnu` by doing the following:
```bash
# rename old library so it is not used
sudo mv /opt/lampp/lib/libstdc++.so.6 /opt/lampp/lib/libstdc++.so.6.old
# link to the system installation of the standard library
sudo ln -s /usr/lib/x86_64-linux-gnu/libstdc++.so.6 /opt/lampp/lib/libstdc++.so.6
```

### 4.2. Build the Executables

To build these executables, navigate to the `executables` directory and run `make`:

```bash
cd <PATH_TO_REPOSITORY>/executables/
make
```

If running on a XAMPP installation, `<PATH_TO_REPOSITORY>` will be `/opt/lampp/htdocs`.

If running on a stand-along Apache2 installation, `<PATH_TO_REPOSITORY>` will be `/var/www/html`.

## 5. AWS SES

This system uses AWS SES to send emails.

## 5.1. Create an Account with AWS SES

## 5.2. Add Credentials to Apache Environment Variables

Add your credentials as environment variables to your Apache configuration. For XAMPP installations, see [2.1.2. Setup Apache Config for XAMPP](#212-setup-apache-config-for-xampp), for stand-alone Apache2 installations, see [2.2.3. Apache2 Configuration for Standalone Server](#223-setup-environment-variables-in-apache).

## 6. (Optional) Github Webhooks

Setting up Github Webhooks only makes sense on a standalone installation. This feature is not supported by XAMPP installations.

To automatically pull changes from Github, setup webhooks by navigating to your repo on Github, hit 'Settings', then 'Webhooks'.

Create a webhooks:
* The 'Payload URL' should be http://example.com/repo_pull.php (or https:// if you have configured ssl)
* 'Content type' should be 'application/json'
* Create a secret. This secret should then be copied into `<GITHUB_WEBHOOK_SECRET>` in your Apache configuration file (See [2.2.3. Apache2 Configuration for Standalone Server](#223-setup-environment-variables-in-apache)).

The webhook handler (`repo_pull.php`) will automatically pull changes from Github and build the React JS bundle and executables.
