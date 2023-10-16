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
GRANT INSERT, UPDATE, DELETE, SELECT ON school.* TO '<username>'@'localhost';
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
