#include "../include/DebtReduction.hpp"
#include <algorithm>
#include <queue>

/* ----------############### BEGIN Operator Overloads ###############---------- */

bool operator<(const Balance &a, const Balance &b)
{
    return a.amount < b.amount;
}
bool operator>(const Balance &a, const Balance &b)
{
    return a.amount > b.amount;
}

bool operator<(const DebtNetwork::Balance &a, const DebtNetwork::Balance &b)
{
    return a.getAmount() < b.getAmount();
}
bool operator>(const DebtNetwork::Balance &a, const DebtNetwork::Balance &b)
{
    return a.getAmount() > b.getAmount();
}

/* ----------############### END Operator Overloads ###############---------- */



/* ----------############### BEGIN DebtNetwork::Balance Implementations ###############---------- */

Balance DebtNetwork::Balance::getGeneric() const
{
    auto creditor = creditor_weak.lock();
    auto debtor = debtor_weak.lock();
    ::Balance genericBalance(creditor->userID, debtor->userID, this->amount);
    return genericBalance;
}

/* ----------############### END DebtNetwork::Balance Implementations ###############---------- */



/* ----------############### BEGIN DebtNetwork::DebtChain Implementations ###############---------- */

bool DebtNetwork::DebtChain::addLink(const std::shared_ptr<User> creditor, const std::shared_ptr<User> debtor, const int amount)
{
    // cannot add link to already completed chain
    if (!this->complete)
    {
        this->chain.emplace_back(creditor, debtor, amount);
        // update state as completed if the creditor just inserted was the root user
        this->complete = creditor->userID == this->chain.front().getDebtor()->userID;
        this->dirty = true;
        this->dirtyMinBalance = true;
    }
    return this->complete;
}

void DebtNetwork::DebtChain::updateBalance(const int creditorID, const int debtorID, const int newAmount)
{
    // find the balance with given creditorID and debtorID
    auto matchingBalance = std::find_if(this->chain.begin(), this->chain.end(),
        [&creditorID, &debtorID] (const DebtNetwork::Balance &balance)
        {
            return (balance.getCreditor()->userID == creditorID &&
                    balance.getDebtor()->userID == debtorID);
        });
    // balance with this creditor and debtor were found
    if (matchingBalance != this->chain.end())
    {
        matchingBalance->amount = newAmount;
        this->dirty = true;
        this->dirtyMinBalance = true;
    }
}

int DebtNetwork::DebtChain::getMinBalance() const
{
    // if either dirty flag is not set, cached result will be returned
    if (this->dirty && this->dirtyMinBalance)
    {
        // dirty flag(s) were set, we must re-calculate
        this->fillCachedMinBalance();
    }
    return this->minBalance;
}

int DebtNetwork::DebtChain::getNumBalancesCancelled() const
{
    // if dirty flag is not set, cached result will be returned
    if (this->dirty)
    {
        // dirty flag set, we must re-calculate
        this->fillCachedReductionStats();
    }
    return this->numBalancesCancelled;
}

int DebtNetwork::DebtChain::getTotalDebtReduced() const
{
    // if dirty flag is not set, cached result will be returned
    if (this->dirty)
    {
        // dirty flag set, we must re-calculate
        this->fillCachedReductionStats();
    }
    return this->totalDebtReduced;
}

DebtChain DebtNetwork::DebtChain::getGeneric() const
{
    ::DebtChain genericChain(this->getMinBalance(), this->getNumBalancesCancelled(), this->getTotalDebtReduced());
    for (auto debtLink : this->chain)
    {
        genericChain.chain.emplace_back(debtLink.getCreditor()->userID, debtLink.getDebtor()->userID, debtLink.amount);
    }
    return genericChain;
}

bool DebtNetwork::DebtChain::isInChain(std::shared_ptr<User> user) const
{
    auto matchingBalance = std::find_if(this->chain.begin(), this->chain.end(),
        [&user] (const DebtNetwork::Balance &balance)
        {
            return user->userID == balance.getDebtor()->userID;
        });
    // find_if returns this->chain.end() if no matches were found
    return matchingBalance != this->chain.end();
}

void DebtNetwork::DebtChain::fillCachedReductionStats() const
{
    int numBalancesCancelled = 0, totalDebtReduced = 0;

    // if minimum was not already calculated
    if (dirtyMinBalance)
    {
        this->fillCachedMinBalance();
    }

    // iterate over the chain to get the debts reduced
    for (auto &balance : this->chain)
    {
        // given the minimum balance, calculate this balance's contribution to reduction statistics
        int amountReduced = balance.amount - this->minBalance;
        if (amountReduced == 0)
        {
            numBalancesCancelled++;
        }
        totalDebtReduced += amountReduced;
    }

    // update class vars
    this->numBalancesCancelled = numBalancesCancelled;
    this->totalDebtReduced = totalDebtReduced;
    // clear dirty flag
    this->dirty = false;
}

void DebtNetwork::DebtChain::fillCachedMinBalance() const
{
    // the debt amount to consider is the least debt in the chain
    // minimumDebtEntry is an iterator of the type DebtNetwork::reductionChainEntry_t
    auto minimumBalance = std::min_element(this->chain.begin(), this->chain.end());
    if (minimumBalance == this->chain.end())
    {
        this->minBalance = 0;
    }
    this->minBalance = minimumBalance->amount;
    this->dirtyMinBalance = false;
}

/* ----------############### END DebtNetwork::DebtChain Implementations ###############---------- */



/* ----------############### BEGIN Reduction Implementations ###############---------- */

void Reduction::mergeDebtChain(const DebtChain &chain)
{
    // iterator over all debts in the change
    for (auto &newBalance : chain.getChain())
    {
        // if there is already a debt with matching creditor and debtor
        auto existingBalance = std::find_if(this->balances.begin(), this->balances.end(),
            [&newBalance] (const Balance &balance)
            {
                return (newBalance.creditorID == balance.creditorID &&
                        newBalance.debtorID == balance.debtorID);
            });
        if (existingBalance != this->balances.end())
        {
            // balance previously existed, just modify it
            existingBalance->amount -= chain.amountReduced;
        }
        else
        {
            // balance doesn't already exist, insert the reduced balance
            this->balances.emplace_back(newBalance.creditorID, newBalance.debtorID, newBalance.amount - chain.amountReduced);
        }
    }
}

/* ----------############### END Reduction Implementations ###############---------- */



/* ----------############### BEGIN DebtNetwork Implementations ###############---------- */

DebtNetwork::DebtNetwork(int rootUserID)
{
    this->rootUser = std::make_shared<User>(rootUserID);
    this->users.insert({rootUserID, this->rootUser});
}

std::shared_ptr<User> DebtNetwork::getOrCreateUser(int userID)
{
    // check that userID maps to a User instance
    auto creditor_it = this->users.find(userID);
    if (creditor_it == this->users.end())
    {
        // user instance was not already created, make one now
        std::shared_ptr<User> user(new User(userID));
        this->users.insert({userID, user});
        return user;
    }
    // User instance was found
    return creditor_it->second;
}

void DebtNetwork::addBalance(int creditorID, int debtorID, int amount)
{
    // find the corresponding User objects
    std::shared_ptr<User> creditor = this->getOrCreateUser(creditorID);
    std::shared_ptr<User> debtor = this->getOrCreateUser(debtorID);

    // use User objects to call addBalance in User class
    User::addBalance(creditor, debtor, amount);

    // invalidate all past complete chains
    this->completeChains.clear();
}

const Reduction DebtNetwork::runExpenseReduction()
{
    this->computeDebtChains();
    return this->selectBestReduction();
}

/*  1. assemble a list of user for whom userID is a creditor, and the amount (call them credits)
    2. starting from the given userID, inspect all creditors with an amount >= the amount of userID's credits
    3. for each of the users to be inspected, check...
        3a. If they are a creditor to one of the userID's creditor's of an amount >= the userID's credits...
            this is a valid candidate for debt reduction
        3b. If they are a debtor, repeat step (3) for their creditor
*/
void DebtNetwork::computeDebtChains()
{
    // invalidate all past debt chains
    this->completeChains.clear();

    // queue of partial chains to loop over
    std::queue<DebtNetwork::DebtChain> partialChains;
    // first iteration of the loop will search all creditor's of the root user
    for (const auto &debt : this->rootUser->getDebts())
    {
        // start each partial reduction with the debt from the current user
        DebtNetwork::DebtChain partialChain;

        // first link in the chain is the debt from the root user
        partialChain.addLink(debt.getCreditor(), this->rootUser, debt.getAmount());

        // add this chain to the vector of partial chains to search
        partialChains.push(partialChain);
    }

    // for the first iteration, no reductions will be found, because...
    //  the root user's creditors cannot, by definition, owe money to the root user

    // each iteration of this loop, pop off one partial chain to inspect it
    // while inspecting the chain, it may be completed and then stored in the class' list of complete chains..
    //      the chain may also be extended, in which case 1 or more partial chains may be pushed back into the queue
    while (partialChains.size() > 0)
    {
        // remove the first partial chain for inspection
        auto partialChain = partialChains.front();
        partialChains.pop();

        // last creditor in the chain
        std::shared_ptr<User> lastCreditor = partialChain.getLastCreditor();

        // add all of the last creditor's creditors to the chain
        for (const auto &debt : lastCreditor->getDebts())
        {
            // addLink returns true if this inserted link completed the chain
            if (partialChain.addLink(debt.getCreditor(), lastCreditor, debt.getAmount()))
            {
                // store complete chain in class var
                this->completeChains.push_back(partialChain);
            }

            // only continue searching this chain if it's not already the maximum size
            if (partialChain.numLinks() < DebtNetwork::DebtChain::MAX_CHAIN_LINKS)
            {
                partialChains.push(partialChain);
            }
        }
    }
}

const Reduction DebtNetwork::selectBestReduction() const
{
    // result of best reductions
    Reduction reduction;
    // copy of complete chains
    DebtNetwork::completeChainVector_t completeChains = this->completeChains;

    // loop will choose the best reduction, then continue if there are other reductions
    while (completeChains.size() > 0)
    {
        auto optimalChain = selectBestChain(completeChains);
        // store the reduced debts
        reduction.mergeDebtChain(optimalChain->getGeneric());
        // remove optimal reduction
        completeChains.erase(optimalChain);
        // update list of chains with those not broken after the optimal chain was calculated
        completeChains = calcChainsNotBroken(completeChains, *optimalChain);
    }

    return reduction;
}

DebtNetwork::completeChainVector_t::iterator DebtNetwork::selectBestChain(
    const DebtNetwork::completeChainVector_t &completeChains) const
{
    // FIRST, choose the "best" to be the one that cancels the most debts
    // get the maximum amount of debts cancelled
    int maxNumCancelled = std::max_element(completeChains.begin(), completeChains.end(),
        // return true if debts cancelled in a is less than debts cancelled in b (a < b)
        [] (const DebtNetwork::DebtChain &a, const DebtNetwork::DebtChain &b)
        {
            return a.getNumBalancesCancelled() < b.getNumBalancesCancelled();
        })->getNumBalancesCancelled();
    // get all elements with that number of debts cancelled
    std::vector<DebtNetwork::DebtChain> reductionsWithMaxCancelled;
    std::copy_if(completeChains.begin(), completeChains.end(), std::back_inserter(reductionsWithMaxCancelled),
        // return true if debts cancelled in equal to the max debts cancelled
        [&maxNumCancelled] (const DebtNetwork::DebtChain &chain)
        {
            return chain.getNumBalancesCancelled() == maxNumCancelled;
        });
    // filtering by maxNumCancelled yielded only 1 result
    if (reductionsWithMaxCancelled.size() == 1)
    {
        // we've found the optimal debt by the first criteria
        return reductionsWithMaxCancelled.begin();
    }


    // SECOND, choose the "best" to be the one with the fewest participants
    auto minNumberParticipants = std::min_element(
        reductionsWithMaxCancelled.begin(),
        reductionsWithMaxCancelled.end(),
        // return true if num participants in a is less than num participants in b (a < b)
        [] (const DebtNetwork::DebtChain &a, const DebtNetwork::DebtChain &b)
        {
            return a.numLinks() < b.numLinks();
        })->numLinks();
    // get all elements with that number of participants
    std::vector<DebtNetwork::DebtChain> reductionsWithFewestParticipants;
    std::copy_if(completeChains.begin(), completeChains.end(), std::back_inserter(reductionsWithFewestParticipants),
        // return true if debts cancelled in equal to the max debts cancelled
        [&minNumberParticipants] (const DebtNetwork::DebtChain &chain)
        {
            return chain.numLinks() == minNumberParticipants;
        });
    // filtering by maxNumCancelled and fewest participants yielded only 1 result
    if (reductionsWithFewestParticipants.size() == 1)
    {
        // we've found the optimal debt by the second criteria
        return reductionsWithFewestParticipants.begin();
    }


    // THIRD consider the magnitude of the debt reduced for each user
    auto maxDebtReduced = std::max_element(
        reductionsWithMaxCancelled.begin(),
        reductionsWithMaxCancelled.end(),
        // return true if total debt reduced in a is less than total debt reduced in b (a < b)
        [] (const DebtNetwork::DebtChain &a, const DebtNetwork::DebtChain &b)
        {
            return a.getMinBalance() < b.getMinBalance();
        });
    // no other option, just take the first match
    return maxDebtReduced;
}

DebtNetwork::completeChainVector_t DebtNetwork::calcChainsNotBroken(
    const DebtNetwork::completeChainVector_t &completeChains,
    const DebtChain &reducedChain) const
{
    DebtNetwork::completeChainVector_t completeChainsNotBroken;

    // for each chain in completeChain
    for (auto chain : completeChains)
    {
        // for each link in that chain
        for (auto balance_it = chain.getChain().begin(); balance_it != chain.getChain().end(); balance_it++)
        {
            // get balances in this chain that have the same creditor and debtor as a balance in the reduced chain
            auto matchingReducedChainBalance = std::find_if(reducedChain.getChain().begin(), reducedChain.getChain().end(),
                [&balance_it] (const DebtNetwork::Balance &reducedChainBalance)
                {
                    return (balance_it->getCreditor()->userID == reducedChainBalance.getCreditor()->userID &&
                            balance_it->getDebtor()->userID == reducedChainBalance.getDebtor()->userID);
                });
            if (matchingReducedChainBalance != reducedChain.getChain().end())
            {
                // balance was also in the reduced balance, update it
                chain.updateBalance(
                    balance_it->getCreditor()->userID,
                    balance_it->getDebtor()->userID,
                    balance_it->getAmount() - reducedChain.getMinBalance());
                // if updated balance is <= 0, the chain was broken and we need not continue searching balances
                if (chain.getIsBroken()) break;
            }
        }

        // only keep chain if it's not broken
        if (!chain.getIsBroken())
        {
            completeChainsNotBroken.push_back(chain);
        }
    }

    return completeChainsNotBroken;
}

/* ----------############### END DebtNetwork Implementations ###############---------- */


/* ----------############### BEGIN User Implementations ###############---------- */

void User::addBalance(std::shared_ptr<User> creditor, std::shared_ptr<User> debtor, int amount)
{
    // don't bother storing 0 balances
    if (amount == 0)
    {
        return;
    }

    // add the negative amount to the creditor
    // check if debtor is already in the creditors's balances vector
    auto existingBalance = std::find_if(creditor->balances.begin(), creditor->balances.end(),
        [debtor] (const User::UserBalance &balance)
        {
            return (balance.getUser() == debtor);
        });
    if (existingBalance != creditor->balances.end())
    {
        // balance previously existed, just modify it
        // for the creditor, the balance should be negative, subtract it
        existingBalance->getAmount() -= amount;
    }
    else
    {
        // balance between these users doesn't already exist
        creditor->balances.emplace_back(debtor, -1*amount);
    }

    // add the positive amount to the debtor
    // check if creditor is already in the debtor's balances vector
    existingBalance = std::find_if(debtor->balances.begin(), debtor->balances.end(),
        [creditor] (const User::UserBalance &balance)
        {
            return (balance.getUser() == creditor);
        });
    if (existingBalance != debtor->balances.end())
    {
        // balance previously existed, just modify it
        // for the debtor, the balance should be positive, add it
        existingBalance->getAmount() += amount;
    }
    else
    {
        // balance between these users existed
        debtor->balances.emplace_back(creditor, amount);
    }
}

const std::vector<User::Credit> User::getCredits() const
{
    std::vector<User::Credit> credits;
    // copy user balances with a negative amount
    std::copy_if(this->balances.begin(), this->balances.end(), std::back_inserter(credits),
        [] (const User::UserBalance &balance)
        {
            return (balance.getAmount() < 0);
        });
    return credits;
}

const std::vector<User::Debt> User::getDebts() const
{
    std::vector<User::Debt> debts;
    // copy user balances with a positive amount
    std::copy_if(this->balances.begin(), this->balances.end(), std::back_inserter(debts),
        [] (const User::UserBalance &balance)
        {
            return (balance.getAmount() > 0);
        });
    return debts;
}

/* ----------############### END User Implementations ###############---------- */
