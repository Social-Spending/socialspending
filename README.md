# Social Spending

An application to easily manage and track split expenses between a group of friends.

## Dependencies

THe only dependency is XAMPP v8.2.4

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

```
git config --global --add safe.directory /opt/lampp/htdocs/
```

From the XAMPP GUI, under the 'Manage Servers' tab, select the 'Start All' button.

## Setting up the database

Once all your servers have been started, goto `http://localhost/phpmyadmin/`

Run the SQL instructions included in `database.sql` to create the tables in the social_spending database.

Create a username and password for the application to access your database, filling in the password of your choosing.
Remember this password, as you will need it in the next step.
```sql
CREATE USER 'php'@'localhost' IDENTIFIED WITH mysql_native_password BY 'password';
GRANT INSERT, UPDATE, DELETE, SELECT ON `social_spending`.* TO 'php'@'localhost';
```

Finally, fill in the password created in the above command in `$databasePassword` (line 5) of `templates/connection.php`
