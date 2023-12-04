#ifndef DEBT_REDUCTION_HPP
#define DEBT_REDUCTION_HPP

#include <tuple>
#include <vector>
#include <unordered_map>
#include <memory>

// terminal of debt vectors, is a user
class User
{
    public:
    // Debt vector from this user
    class UserBalance
    {
        public:
        UserBalance() = delete;
        UserBalance(const UserBalance &balance) = default;
        UserBalance(const std::shared_ptr<User> user, const int amount): user_weak(user), amount(amount) {}

        inline std::shared_ptr<User> getUser() const { return this->user_weak.lock(); }
        inline int getAmount() const { return this->amount; }
        inline int& getAmount() { return this->amount; }

        protected:
        std::weak_ptr<User> user_weak;
        int amount;
    };

    // specialization of debt vector to make code readable
    class Credit : public UserBalance
    {
        public:
        Credit() = delete;
        Credit(const UserBalance &balance) : UserBalance::UserBalance(balance) {}
        inline std::shared_ptr<User> getDebtor() const { return this->user_weak.lock(); }
    };
    class Debt : public UserBalance
    {
        public:
        Debt() = delete;
        Debt(const UserBalance &balance) : UserBalance::UserBalance(balance) {}
        inline std::shared_ptr<User> getCreditor() const { return this->user_weak.lock(); }
    };

    // constructor
    User(int userID): userID(userID) {}

    // add a new balance between the given two users
    static void addBalance(std::shared_ptr<User> creditor, std::shared_ptr<User> debtor, int amount);

    // get a list of (user, amount) tuples of balances where this user is owed
    const std::vector<User::Credit> getCredits() const;

    // get a list of (user, amount) tuples of balances where this user owes
    const std::vector<User::Debt> getDebts() const;

    const int userID;

    private:
    // vectors of balance tuples
    std::vector<User::UserBalance> balances;
};

class Balance;
class DebtChain;

// collection of generic reduced balances
class Reduction
{
    using balances_t = std::vector<Balance>;

    public:
    Reduction() = default;
    Reduction(const Reduction &chain) = default;

    inline const balances_t& getReducedBalances() const { return this->balances; }

    void mergeDebtChain(const DebtChain &chain);

    private:
    // vector of balances involved in the chain
    balances_t balances;
};

// container of User instances
class DebtNetwork
{
    public:
    class DebtChain;
    // general debt vector, where both debtor and creditor are specified
    // amount should always be positive, but I didn't add any checks for this
    class Balance
    {
        public:

        Balance() = delete;
        Balance(const DebtNetwork::Balance &balance) = default;
        Balance(const std::shared_ptr<User> creditor, const std::shared_ptr<User> debtor, const int amount) :
            creditor_weak(creditor), debtor_weak(debtor), amount(amount) {}

        // turn into a generic balance
        ::Balance getGeneric() const;

        inline int getAmount() const { return this->amount; }
        inline std::shared_ptr<User> getCreditor() const { return this->creditor_weak.lock(); }
        inline std::shared_ptr<User> getDebtor() const { return this->debtor_weak.lock(); }

        friend class DebtNetwork::DebtChain;

        private:
        std::weak_ptr<User> creditor_weak, debtor_weak;
        int amount;
    };

    // loop of debts between users, and how much all debts will be reduced by
    class DebtChain
    {
        using chain_t = std::vector<DebtNetwork::Balance>;

        public:
        // maximum number of users that can participate in a chain
        static const DebtNetwork::DebtChain::chain_t::size_type MAX_CHAIN_LINKS = 5u;
        // minimum number of users that can participate in a chain
        static const DebtNetwork::DebtChain::chain_t::size_type MIN_CHAIN_LINKS = 3u;

        DebtChain() { this->chain_id = this->CHAIN_ID_GENERATOR++; };
        DebtChain(const DebtNetwork::DebtChain &chain) = default;

        // the least debt in the chain
        // return value should always be positive
        int getMinBalance() const;

        // get the number of balances that would be reduced to 0 if this chain is reduced
        int getNumBalancesCancelled() const;

        // get the sum of amounts by which debts will be reduced is this chain is reduced
        int getTotalDebtReduced() const;

        // get unique id for this chain
        unsigned int getChainID() const { return this->chain_id; }

        // turn this debt chain into a generic debt chain
        ::DebtChain getGeneric() const;

        // add a balance to the chain
        // return if this link completed the chain
        bool addLink(const std::shared_ptr<User> creditor, const std::shared_ptr<User> debtor, const int amount);

        // update balance between two users
        void updateBalance(const int creditorID, const int debtorID, const int newAmount);

        // return the creditor for the last link in the chain
        inline std::shared_ptr<User> getLastCreditor() const { return this->chain.back().creditor_weak.lock(); }

        // return the creditor for the first link in the chain
        inline std::shared_ptr<User> getFirstCreditor() const { return this->chain.front().creditor_weak.lock(); }

        // return the current number of links in the chain
        inline chain_t::size_type numLinks() const { return this->chain.size(); }

        // return the chain
        inline const chain_t& getChain() const { return this->chain; }

        // return true if the given user is already a debtor in the chain
        bool isInChain(std::shared_ptr<User> user) const;

        // return if chain is broken or not
        inline bool getIsBroken() const { return this->isBroken; }

        private:
        // fill cached results for minBalance, numBalancesCancelled, and totalDebtReduced
        //      this function allows the possibility to calculate ...
        //      minBalance, numBalancesCancelled, and totalDebtReduced simultaneously
        void fillCachedReductionStats() const;
        // fill cached results for minBalance
        void fillCachedMinBalance() const;
        // vector of balances involved in the chain
        chain_t chain;
        // indicate if chain is complete or not
        bool complete = false;
        // indicate if chain was broken by an update
        bool isBroken = false;
        // cache vars are 'mutable' which means they may be modified withing a const function
        // bool indicate if cached results are invalidated by adding a new link
        mutable bool dirty = false, dirtyMinBalance = false;
        // cached results for minimum balance and total debt reduced
        mutable int minBalance = 0, numBalancesCancelled = 0, totalDebtReduced = 0;
        unsigned int chain_id;
        static unsigned int CHAIN_ID_GENERATOR;
    };

    using completeChainVector_t = std::vector<DebtNetwork::DebtChain>;

    // constructor
    DebtNetwork(int rootUserID);

    // add a new balance between two users, identified by user_id
    void addBalance(int creditorID, int debtorID, int amount);

    // actually do the expense reduction algorithm
    // returns balances updated in the most optimal reduction for this debt network
    const Reduction runExpenseReduction();

    // returns a list of debt chains that can be used to settle-up with the given creditor's userID
    std::vector<::DebtChain> getSettleUpOptions(int creditorID) const;

    private:
    // get a pointer to the User instance associated with the given userID
    // if no instance exists, create one
    std::shared_ptr<User> getOrCreateUser(int userID);

    // breadth-first search of the debt network for debt chains...
    //      beginning and ending at the root user
    void computeDebtChains();

    // returns balances updated in the most optimal reduction for this debt network
    // should be called after computeDebtChains
    const Reduction selectBestReduction() const;

    // helper function for selectBestReduction, return iterator to optimal debt chain
    DebtNetwork::DebtChain selectBestChain(
        const DebtNetwork::completeChainVector_t &completeChains) const;

    // helper function for selectBestReduction...
    // return new list of chains not broken by reducing the given chain
    DebtNetwork::completeChainVector_t calcChainsNotBroken(
        const DebtNetwork::completeChainVector_t &completeChains,
        const DebtChain &reducedChain) const;

    // map userIDs to User instances
    std::unordered_map<int, std::shared_ptr<User>> users;
    // userID from whom the network originates
    std::shared_ptr<User> rootUser;
    // list of complete debt chains in the network
    DebtNetwork::completeChainVector_t completeChains;
};

// generic case of a balance between two users, where users are identified by id
// can be used to compare balances between debt networks
class Balance
{
    public:
    Balance() = delete;
    Balance(const Balance &balance) = default;
    Balance(const int creditorID, const int debtorID, const int amount) :
        creditorID(creditorID), debtorID(debtorID), amount(amount) {}
    const int creditorID, debtorID;
    int amount;
};

// generic debt chain, can be used to compare chains between two debt networks
// instances of this class must be complete
class DebtChain
{
    using chain_t = std::vector<Balance>;

    public:
    DebtChain() = delete;
    DebtChain(const DebtChain &chain) = default;

    inline const chain_t& getChain() const { return this->chain; }

    friend DebtChain DebtNetwork::DebtChain::getGeneric() const;

    const int amountReduced, numBalancesCancelled, totalDebtReduced;

    private:
    DebtChain(const int amountReduced, const int numBalancesCancelled, const int totalDebtReduced) :
        amountReduced(amountReduced),
        numBalancesCancelled(numBalancesCancelled),
        totalDebtReduced(totalDebtReduced) {}
    // vector of balances involved in the chain
    chain_t chain;
};

#endif // DEBT_REDUCTION_HPP
