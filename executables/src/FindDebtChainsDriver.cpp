#include <iostream>
#include <string>
#include <sstream>
#include <memory>
#include "../include/DebtReduction.hpp"

int importDebtNetwork(std::shared_ptr<DebtNetwork> debtNetwork)
{
    std::string line;
    int creditor, debtor, amount;
    // keep track of line number for error tracking
    int lineNum = 1;
    while(std::cin >> line)
    {
        std::stringstream ss(line);
        // based on rigid line syntax
        if (!(ss >> creditor)) return lineNum;
        if (ss.peek() != ',') return lineNum;
        ss.ignore();
        if (!(ss >> debtor)) return lineNum;
        if (ss.peek() != ',') return lineNum;
        ss.ignore();
        if (!(ss >> amount)) return lineNum;

        // add the given balance
        debtNetwork->addBalance(creditor, debtor, amount);
        lineNum++;
    }
    return 0;
}

void exportSettleUpOptions(std::vector<DebtChain> options)
{
    for (std::vector<DebtChain>::size_type i = 0; i < options.size(); i++)
    {
        const DebtChain &chain = options[i];
        for (const auto &link : chain.getChain())
        {
            std::cout << i << ',' << link.creditorID << ',' << link.debtorID << ',' << chain.amountReduced << std::endl;
        }
    }
}

int main(int argc, char **argv)
{
    // get given user's userID from command line args
    if (argc < 3)
    {
        std::cerr << "Must specify the transaction_id by command-line arg." << std::endl;
        std::cerr << "Usage: ./FindDebtChains <Current User ID> <Creditor User ID>" << std::endl;
        std::cerr << "Then supply the debt network as a newline-delimited of the format \"<creditorID>,<debtorID>,<amount>\" to stdin" << std::endl;
        std::cerr << "Output will be of the form <chain id>,<creditor>,<debtor>,<amount>" << std::endl;
        return 1;
    }
    int currUID = atoi(argv[1]);
    if (!currUID)
    {
        std::cerr << "Current User ID by command-line arg is not integrable." << std::endl;
        return 1;
    }
    int creditorUID = atoi(argv[2]);
    if (!creditorUID)
    {
        std::cerr << "Creditor User ID by command-line arg is not integrable." << std::endl;
        return 1;
    }

    // now, get the debt network from stdin
    std::shared_ptr<DebtNetwork> debtNetwork = std::make_shared<DebtNetwork>(currUID);
    // importDebtNetwork will print the line it failed on
    int errorLine = importDebtNetwork(debtNetwork);
    if (errorLine)
    {
        std::cerr << "Failed to import debt network from stdin, line " << errorLine << std::endl;
        return 1;
    }

    // find settle-up options
    std::vector<DebtChain> options = debtNetwork->getSettleUpOptions(creditorUID);
    exportSettleUpOptions(options);

    // Exit (Success)
    return 0;
}