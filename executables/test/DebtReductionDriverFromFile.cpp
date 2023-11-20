#include "../include/DebtReduction.hpp"
#include "./DebtNetworkInputMgr.hpp"
#include <fstream>
#include <iostream>
#include <algorithm>

int main(int argc, char **argv)
{
    // get filenames from command line args
    if (argc < 3)
    {
        std::cerr << "Must specify the input and output files by command-line arg." << std::endl;
        std::cerr << "Usage: ./DebtReductionFromFile [input] [output]" << std::endl;
        return 1;
    }
    char *inFilename = argv[1];
    char *outFilename = argv[2];


    DebtNetworkInputMgr inputMgr(inFilename);
    //auto &userIDs = inputMgr.getUsers();
    auto balances = inputMgr.getBalances();

    // run debt reduction algorithm
    DebtNetwork debtNetwork(1);
    for (const auto &balance : balances)
    {
        debtNetwork.addBalance(balance.creditorID, balance.debtorID, balance.amount);
    }
    Reduction reducedBalances = debtNetwork.runExpenseReduction();
    for (const auto &reducedBalance : reducedBalances.getReducedBalances())
    {
        // find the balance with
        auto balance_it = std::find_if(balances.begin(), balances.end(),
            [&reducedBalance] (const DebtNetworkInputMgr::Balance &balance)
            {
                return (reducedBalance.creditorID == balance.creditorID &&
                        reducedBalance.debtorID == balance.debtorID);
            });
        if (balance_it == balances.end())
        {
            // how was it not found??
            balance_it->reducedAmount = balance_it->amount;
        }
        // store updated balance
        balance_it->reducedAmount = reducedBalance.amount;
    }

    // print out balances
    std::ofstream outFile(outFilename);
    if (outFile.is_open())
    {
        // csv header
        outFile << "creditorID,debtorID,amount,reducedAmount" << std::endl;
        // write out reduced balances
        for (const auto &balance : balances)
        {
            outFile << balance.creditorID
                    << ',' << balance.debtorID
                    << ',' << balance.amount
                    << ',' << balance.reducedAmount
                    << std::endl;
        }
    }
}