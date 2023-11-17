#include <iostream>
#include <string>
#include "../include/mariadb/conncpp.hpp"
#include "../include/DebtReduction.hpp"

// Function to Add Contact
void getUsers(std::shared_ptr<sql::PreparedStatement> &stmnt,
   sql::SQLString first_name,
   sql::SQLString last_name,
   sql::SQLString email)
{
   try {
      // Bind variables to prepared statement parameters
      // Note that the index starts at 1--not 0
      stmnt->setString(1, first_name);
      stmnt->setString(2, last_name);
      stmnt->setString(3, email);

      // Execute Statement
      stmnt->executeUpdate();
   }

   // Handle Exceptions
   catch (sql::SQLException &e) {
      std::cerr << "Error adding contact to database: "
         << e.what() << std::endl;
   }
}

// exceptions will be caught by try...catch in main
void expenseReductionFromUser(std::shared_ptr<sql::Connection> conn, int rootUserID)
{
    // get all debt's between a user's friends
    std::string sql =   "SELECT d.creditor, d.debtor, d.amount as amount"
                        " FROM debts d"
                        " WHERE d.creditor = ? OR d.debtor = ?"
                        " OR ("
                            " (d.creditor, d.debtor) IN (SELECT user_id_1, user_id_2 FROM friendships WHERE user_id_1 = ?)"
                            " OR"
                            " (d.creditor, d.debtor) IN (SELECT user_id_2, user_id_1 FROM friendships WHERE user_id_2 = ?)"
                        ");";
    std::shared_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(sql));
    stmnt->setInt(1, rootUserID);
    stmnt->setInt(2, rootUserID);
    stmnt->setInt(3, rootUserID);
    stmnt->setInt(4, rootUserID);
    std::unique_ptr<sql::ResultSet> result(stmnt->executeQuery());

    // loop through results and store in DebtNetwork
    std::unique_ptr<DebtNetwork> debtNetwork(new DebtNetwork(rootUserID));
    int creditorID, debtorID, amount;
    std::cout << "Network for User " << rootUserID << std::endl;
    while (result->next())
    {
        // TODO buffer results in a vector and remove debts that will be affected by pending transactions
        // columns are indexed from 1
        creditorID = result->getInt(1);
        debtorID = result->getInt(2);
        amount = result->getInt(3);
        debtNetwork->addBalance(creditorID, debtorID, amount);
        std::cout << "  creditorID: " << creditorID << " debtorID: " << debtorID << " amount: " << amount << std::endl;
    }

    // run the algorithm
    const Reduction updatedBalances = debtNetwork->runExpenseReduction();

    // if results were not empty, update database
    std::cout << "Updated balances for User " << rootUserID << std::endl;
    for (auto &balance : updatedBalances.getReducedBalances())
    {
        std::cout << "  creditorID: " << balance.creditorID << " debtorID: " << balance.debtorID << " amount: " << balance.amount << std::endl;

        continue;
        // modify balance
        std::string sql =   "UPDATE debts"
                            " SET amount = ?"
                            " WHERE (creditor, debtor) = (?, ?);";
        std::shared_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(sql));
        stmnt->setInt(1, balance.amount);
        stmnt->setInt(2, balance.creditorID);
        stmnt->setInt(3, balance.debtorID);
        std::unique_ptr<sql::ResultSet> result(stmnt->executeQuery());
    }
}

int main(int argc, char **argv)
{
    // get given user's userID from command line ars
    if (argc < 2)
    {
        std::cerr << "Must specify the transaction_id by command-line arg." << std::endl;
        std::cerr << "Usage: ./DebtReduction <transaction_id>" << std::endl;
        return 1;
    }
    int transactionID = atoi(argv[1]);
    if (!transactionID)
    {
        std::cerr << "transaction_id by command-line arg was either string or not integrable." << std::endl;
        return 1;
    }


    try {
        // Instantiate Driver
        sql::Driver* driver = sql::mariadb::get_driver_instance();

        // Configure Connection from environment vars
        const char* dbUser = std::getenv("DB_USER");
        const char* dbPass = std::getenv("DB_PASS");
        const char* dbName = std::getenv("DB");
        if (dbUser == nullptr || dbPass == nullptr || dbName == nullptr)
        {
            std::cerr << "Must specify DB_USER, DB_PASS, and DB environment variables" << std::endl;
            return 1;
        }
        // The URL or TCP connection string format is
        // ``jdbc:mariadb://host:port/database``.
        sql::SQLString url("jdbc:mariadb://localhost:3306/" + std::string(dbName));

        // Use a properties map for the other connection options
        sql::Properties properties({
            {"user", dbUser},
            {"password", dbPass},
        });

        // Establish Connection
        std::shared_ptr<sql::Connection> conn(driver->connect(url, properties));


        // get all participants of the transaction
        std::string sql =   "SELECT user_id"
                            " FROM transaction_participants"
                            " WHERE transaction_id = ?";
        std::shared_ptr<sql::PreparedStatement> stmnt(conn->prepareStatement(sql));
        stmnt->setInt(1, transactionID);
        std::unique_ptr<sql::ResultSet> result(stmnt->executeQuery());
        // store list of participants in a vector
        std::vector<int> participantIDs;
        while (result->next())
        {
            participantIDs.push_back(result->getInt(1));
        }

        for (auto participantID_it = participantIDs.begin();
            participantID_it != participantIDs.end();
            participantID_it++)
        {
            expenseReductionFromUser(conn, *participantID_it);
        }


      // Close Connection
      conn->close();
    }
    catch (sql::SQLException& e) {
        std::cerr << "Error Connecting to the database: "
            << e.what() << std::endl;

        // Exit (Failed)
        return 1;
    }

    // Exit (Success)
    return 0;
}
