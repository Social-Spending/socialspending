# Social Spending

An application to easily manage and track split expenses between a group of friends.

## Dependencies

* XAMPP v8.2.4
* g++
* make
* Also must fulfill dependencies described in `react_source/README.md`


## Linux Setup

### Install LAMPP for Linux

Install XAMPP v8.2.4 for Linux. You may follow the instructions here: [https://itsfoss.com/install-xampp-ubuntu/](https://itsfoss.com/install-xampp-ubuntu/)

On Ubuntu, XAMPP files are placed in `/opt/lampp/`.

### Setup htdocs

Change the permissions of the `htdocs` directory, inside which this repository will be cloned:

``` bash
sudo chmod -R a+rwx /opt/lampp/htdocs
```

Clone the repository into the `htdocs` directory:

```bash
cd /opt/lampp/htdocs
git clone git@github.com:francesmatthew/socialspending.git .
```

If you get an error during cloning, you may need to run the following command

```bash
git config --global --add safe.directory /opt/lampp/htdocs/
```

From the XAMPP GUI, under the 'Manage Servers' tab, select the 'Start All' button.

## Setting up the database

Once all your servers have been started, go to [http://localhost/phpmyadmin/](http://localhost/phpmyadmin/).

Create a new database named `social_spending`.
Afterwards, on the top navigation bar click `Import` then browse your computer for the `database.sql` file.
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

To access databases from PHP scripts, first edit the file `/opt/lampp/etc/httpd.conf`.
At the very end of the file, insert the following code

```
SetEnv DB_USER "<Username>"
SetEnv DB_PASS "<Password>"
SetEnv DB "social_spending"
```

replacing `<Username>` and `<Password>` with the credentials you created the new user with.

To access the database from a PHP script, refer to `templates/connecton.php`.

## Setup Production Environment

### Apache2 Configuration

Edit the sites-available and sites-enabled configs in /etc/apache2/sites-available
```sh
# disable default config
sudo rm /etc/apache2/sites-enabled/000-default.conf
# create file for new config in sites-available
sudo touch /etc/apache2/sites-available/socialspending.conf
# enable the new config by adding a symbolic link in sites-enabled
sudo ln -s /etc/apache2/sites-available/socialspending.conf /etc/apache2/sites-enabled/socialspending.conf
```

Then, add the following lines to `/etc/apache2/sites-available/socialspending.conf`:

```
# production environment
<VirtualHost ${DOMAIN_NAME}:80>
	ServerName ${DOMAIN_NAME}
	ServerAlias www.${DOMAIN_NAME}
	DocumentRoot /var/www/html
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>

# redirect www.domain.com to just domain.com
<VirtualHost www.${DOMAIN_NAME}:80>
	Redirect 301 / http://${DOMAIN_NAME}
</VirtualHost>

# dev environment
<VirtualHost dev.${DOMAIN_NAME}:80>
	ServerName dev.${DOMAIN_NAME}
	DocumentRoot /var/www/dev
	ErrorLog ${APACHE_LOG_DIR}/error.log
	CustomLog ${APACHE_LOG_DIR}/access.log combined
</VirtualHost>
```

Setup environment variables in `/etc/apache2/envvars`:

```
export APACHE_RUN_USER=<APACHE USER>
export APACHE_RUN_GROUP=<APACHE GROUP>

<LINES OMITTED>

export DB_USER="<DB_USERNAME>"
export DB_PASS="<DB_PASSWORD>"
export DB="social_spending"

# secret for authenticating that a webhook request actually came from github
export GITHUB_WEBHOOK_SECRET=<GITHUB_WEBHOOK_SECRET>

export DOMAIN_NAME=example.com
```

Replace `<DB_USERNAME>`, `<DB_PASSWORD>`, and `example.com` with your database credentials and domain name. Replace `<APACHE USER>` and `<APACHE GROUP>` with the user and group of the user used to setup the config. Replace `<GITHUB_WEBHOOK_SECRET>` with the secret setup in the following step:

### Github Webhooks

To automatically pull changes from Github, setup webhooks by navigating to your repo on Github, hit 'Settings', then 'Webhooks'.

Create 2 webhooks:
* The 'Payload URL' of 1 should be http://example.com/repo_pull.php and the other should be http://dev.example.com/repo_pull.php (or https:// if you have configured ssl)
* 'Content type' should be 'application/json' for both
* Create a secret. This should be the same for both, and this secret should then be copied into `<GITHUB_WEBHOOK_SECRET>` in `/etc/apache2/envvars`.

The webhook handler will automatically re-create the database on the dev instance each time a push is made (this must be done manually on the production instance).

### Setting up Repositories

Create the new folder:

```sh
sudo mkdir /var/www/html
sudo mkdir /var/www/
sudo chown USER:GROUP -R /var/www/html /var/www/dev
```

Replacing `USER:GROUP` with the current user and group used for configuration. This should match the `APACHE_RUN_USER` and `APACHE_RUN_GROUP` in `/etc/apache2/envvars`.

In the `/var/www/html` directory
1. Clone the repository using `git clone LINK_TO_REPO -b main`
2. Setup the upstream branch using `git remote set-branches origin main`
3. Run the initial react compilation using `cd react_source && ./compile.sh`

In the `/var/www/dev` directory
1. Clone the repository using `git clone LINK_TO_REPO -b develop`
2. Setup the upstream branch using `git remote set-branches origin develop`
3. Run the initial react compilation using `cd react_source && ./compile.sh`

### NPM setup

If NPM is not already installed globally (to check, run `whereis npx`), add symbolic links in `/usr/local/bin/``

```sh
sudo ln -s NPM_PATH /usr/local/bin/npm
sudo ln -s NPX_PATH /usr/local/bin/npx
sudo ln -s NODE_PATH /usr/local/bin/node
```

Replace `NPM_PATH` with the result of `whereis npm`, repalce `NPX_PATH` with the result of `whereis npx`, and replace `NODE_PATH` with the result of `whereis node`.

Also assure that the latest npm packages have been installed, following the README in the `react_source` directory.
