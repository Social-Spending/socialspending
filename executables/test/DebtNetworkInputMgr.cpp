#include "./DebtNetworkInputMgr.hpp"
#include <ctime>
#include <cstdlib>
#include <fstream>
#include <string>
#include <sstream>
#include <algorithm>

DebtNetworkInputMgr::DebtNetworkInputMgr(unsigned int seed, int numUsers, double maxBalance)
{
    this->numUsers = numUsers ? numUsers : DEFAULT_NUM_USERS;
    this->maxBalance = maxBalance ? maxBalance : DEFAULT_MAX_BALANCE;
    this->buildRandomNetwork(seed);
}

DebtNetworkInputMgr::DebtNetworkInputMgr(char *filename)
{
    this->numUsers = DEFAULT_NUM_USERS;
    this->maxBalance = DEFAULT_MAX_BALANCE;
    this->userIDs.clear();
    this->balances.clear();

    std::string line;
    std::ifstream inFile(filename);
    int creditor, debtor, amount;
    if (inFile.is_open())
    {
        // ignore csv header
        if (!(inFile >> line)) return;

        while(inFile >> line)
        {
            std::stringstream ss(line);
            // based on rigid line syntax
            if (!(ss >> creditor)) return;
            if (ss.peek() != ',') return;
            ss.ignore();
            if (!(ss >> debtor)) return;
            if (ss.peek() != ',') return;
            ss.ignore();
            if (!(ss >> amount)) return;

            // add users, if not already added
            if (std::find(this->userIDs.begin(), this->userIDs.end(), creditor) == this->userIDs.end())
            {
                this->userIDs.push_back(creditor);
            }
            if (std::find(this->userIDs.begin(), this->userIDs.end(), debtor) == this->userIDs.end())
            {
                this->userIDs.push_back(debtor);
            }
            // add balance
            this->balances.emplace_back(creditor, debtor, amount);
        }
        inFile.close();
    }
    // if file doesn't exist, create random inputs
    else
    {
        this->buildRandomNetwork();
        this->write(filename);
    }
}

void DebtNetworkInputMgr::buildRandomNetwork(unsigned int seed)
{
    // seed rng
    if (seed)
    {
        std::srand(seed);
    }
    else
    {
        std::srand(std::time(nullptr));
    }

    // create all userIDs
    for (int i = 1; i <= this->numUsers; i++)
    {
        this->userIDs.push_back(i);
    }

    // create balances
    for (auto user_it = this->userIDs.begin(); user_it != this->userIDs.end(); user_it++)
    {
        for (auto user_it2 = user_it + 1; user_it2 != this->userIDs.end(); user_it2++)
        {
            // cannot create reflexive balance
            if (*user_it == *user_it2) continue;

            // 25% chance of having a balance, sign of balance will determine debtor/creditor
            int balance = (double)(rand() >= RAND_MAX/4) * (((double)rand() + 1.0) / (double)RAND_MAX * 2*this->maxBalance -  this->maxBalance);

            if (balance > 0)
            {
                this->balances.emplace_back(*user_it, *user_it2, balance);
            }
            else if (balance < 0)
            {
                this->balances.emplace_back(*user_it2, *user_it, -1 * balance);
            }
        }
    }
}

int DebtNetworkInputMgr::write(const char *filename) const
{
    std::ofstream outFile(filename);
    // csv header
    if (outFile.is_open())
    {
        outFile << "creditorID,debtorID,amount" << std::endl;
        for (const auto &balance : this->balances)
        {
            outFile << balance.creditorID << ',' << balance.debtorID << ',' << balance.amount << std::endl;
        }
        outFile.close();
        return 0;
    }
    return -1;
}
