#ifndef DEBT_NETWORK_INPUT_MGR_HPP
#define DEBT_NETWORK_INPUT_MGR_HPP

#include <vector>

class DebtNetworkInputMgr
{
    public:
    struct Balance
    {
        Balance(int creditorID, int debtorID, int amount) :
            creditorID(creditorID),  debtorID(debtorID), amount(amount), reducedAmount(amount) {}
        int creditorID, debtorID, amount, reducedAmount;
    };

    DebtNetworkInputMgr(const DebtNetworkInputMgr &inputMgr) = default;

    // builds randomly-generated debt network with given number of users
    // balances will take on integer numbers up to and including the given maxBalance
    // if seed is 0, current time will be used
    DebtNetworkInputMgr(unsigned int seed = 0, int numUsers = 0, double maxBalance = 0);

    // get random inputs from file
    DebtNetworkInputMgr(char *filename);

    const std::vector<int>& getUsers() const { return this->userIDs; }
    const std::vector<Balance>& getBalances() const { return this->balances; }

    // write inputs to file by given name
    // return 0 on success, -1 on failure
    int write(const char *filename) const;

    private:
    static constexpr int DEFAULT_NUM_USERS = 16;
    static constexpr double DEFAULT_MAX_BALANCE = 15.0;
    int numUsers;
    double maxBalance;
    void buildRandomNetwork(unsigned int seed = 0);
    std::vector<int> userIDs;
    std::vector<Balance> balances;
};

#endif // DEBT_NETWORK_INPUT_MGR_HPP
