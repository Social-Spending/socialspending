#include "../include/Wt/WApplication.h"
#include "../include/Wt/WContainerWidget.h"
#include "../include/Wt/WPaintedWidget.h"
#include "../include/Wt/WCircleArea.h"
#include "../include/Wt/WText.h"
#include "../include/Wt/WPainter.h"
#include "../include/Wt/WFlags.h"

#include "../include/DebtReduction.hpp"
#include "./DebtNetworkInputMgr.hpp"

#include <vector>
#include <map>
#include <utility>
#include <algorithm>
#include <complex>
#include <stdexcept>

// constexpr would be better, but causes issues with the linker
#define RADIUS (15.0)
#define TEXT_HEIGHT (10.0)
#define WIDTH (1920)
#define HEIGHT (1080)

namespace WebTest
{
struct User
{
    public:
    User(int userID, double x, double y) :
        userID(userID), x(x), y(y) {}

    // static constexpr double RADIUS = 15.0;
    // static constexpr double TEXT_HEIGHT = 10.0;
    int userID;
    double x, y;
};


class DebtNetworkWidget : public Wt::WPaintedWidget
{
    public:
    DebtNetworkWidget(const std::vector<int> &userIDs, const std::vector<DebtNetworkInputMgr::Balance> &balances);

    protected:
    void paintEvent(Wt::WPaintDevice *paintDevice);

    private:
    std::map<int, User> users;
    std::vector<DebtNetworkInputMgr::Balance> balances;
};

DebtNetworkWidget::DebtNetworkWidget(const std::vector<int> &userIDs, const std::vector<DebtNetworkInputMgr::Balance> &balances) :
WPaintedWidget(), balances(balances)
{
    // size of the view, in pixels
    // the view must fit entire circles, so the width and height used here is slightly smaller
    double width = WIDTH - 2*RADIUS, height = HEIGHT - 2*RADIUS;
    // double centerX = this->width().toPixels()/2;
    // double centerY = this->height().toPixels()/2;
    double centerX = width/2, centerY = height/2;
    double squareDimension = std::min(width, height);
    double coordinateRadius = squareDimension / 2 / std::sqrt(2);
    double angleStep = 2 * 3.141592 / userIDs.size();
    double angle = 0.0;

    // distribute user around a circle and store the User object in a map, indexed by userID
    for (const auto userID : userIDs)
    {
        // determine the coordinate as the real/imaginary component along a circle
        // offset the center of the circle so all the coordinates are positive
        std::complex<double> coordinates = std::polar(coordinateRadius, angle);
        double x = coordinates.real() + centerX;
        double y = coordinates.imag() + centerY;

        // store in map
        User user(userID, x, y);
        users.emplace(userID, user);

        // increment angle around the circle
        angle += angleStep;
    }
    this->resize(WIDTH, HEIGHT);
}


void DebtNetworkWidget::paintEvent(Wt::WPaintDevice *paintDevice)
{
    Wt::WPainter painter(paintDevice);

    // I'm storing locations from the center of the circles, but the circle locations are placed from the top left
    double offsetFromCenter = RADIUS;

    // draw circles for each user
    for (const auto &userPair : this->users)
    {
        const User &user = userPair.second;
        // do the drawing
        // this->addArea(std::make_unique<Wt::WCircleArea>(user.x, user.y, User::RADIUS));
        // this->area(index)->addChild(std::make_unique<Wt::WText>(std::to_string(userID)));
        painter.drawEllipse(
            user.x- offsetFromCenter,
            user.y - offsetFromCenter,
            2*RADIUS,
            2*RADIUS);
        painter.drawText(
            user.x - offsetFromCenter,
            user.y - offsetFromCenter,
            2*RADIUS,
            2*RADIUS,
            Wt::AlignmentFlag::Center | Wt::AlignmentFlag::Middle,
            std::to_string(user.userID));
    }

    // draw all balances as lines between Users
    for (const auto &balance : balances)
    {
        // get the center of the creditor's circle
        auto user_it = users.find(balance.creditorID);
        User creditor = user_it->second;
        // get the center of the debtors's circle
        user_it = users.find(balance.debtorID);
        User debtor = user_it->second;

        // express the los vector from debtor to creditor in polar coordinates
        std::complex<double> los(creditor.x - debtor.x, creditor.y - debtor.y);
        // get the radial distance and angle from the debtor's circle to the creditor's circle
        double mag = std::abs(los), ang = std::arg(los);
        // line offsets from the center of a user's circle to where the line begins/ends
        std::complex<double> debtorOffset = std::polar(RADIUS, ang);
        std::complex<double> creditorOffset = std::polar(-1 * RADIUS, ang);
        // offset from debtor to text
        std::complex<double> textOffset = std::polar(mag/2, ang);

        // draw the line
        double startX = debtor.x + debtorOffset.real();
        double startY = debtor.y + debtorOffset.imag();
        double endX = creditor.x + creditorOffset.real();
        double endY = creditor.y + creditorOffset.imag();
        painter.drawLine(startX, startY, endX, endY);
        painter.drawText(
            debtor.x - 2*RADIUS + textOffset.real(),
            debtor.y - RADIUS + textOffset.imag(),
            2*RADIUS,
            2*RADIUS,
            Wt::AlignmentFlag::Center | Wt::AlignmentFlag::Middle,
            std::to_string(balance.amount) + " / " + std::to_string(balance.reducedAmount));
        // draw the arrow head at the creditor
        std::complex<double> arrowHead1 = std::polar(-1*RADIUS, ang+20.0/180.0*3.141592);
        std::complex<double> arrowHead2 = std::polar(-1*RADIUS, ang-20.0/180.0*3.141592);
        painter.drawLine(
            endX,
            endY,
            endX + arrowHead1.real(),
            endY + arrowHead1.imag());
        painter.drawLine(
            endX,
            endY,
            endX + arrowHead2.real(),
            endY + arrowHead2.imag());
    }
}


class DebtNetworkApplication : public Wt::WApplication
{
    public:
    DebtNetworkApplication(const Wt::WEnvironment& env);

    private:
    void runDebtReduction(std::vector<DebtNetworkInputMgr::Balance> &balances);
};

DebtNetworkApplication::DebtNetworkApplication(const Wt::WEnvironment& env)
    : Wt::WApplication(env)
{
    //auto uri = env.getParameterValues("inputFile");

    DebtNetworkInputMgr inputMgr;
    auto &userIDs = inputMgr.getUsers();
    auto balances = inputMgr.getBalances();

    this->runDebtReduction(balances);

    setTitle("Debt Network Viewer");
    root()->addNew<DebtNetworkWidget>(userIDs, balances);
}


void DebtNetworkApplication::runDebtReduction(std::vector<DebtNetworkInputMgr::Balance> &balances)
{

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
}
}

int main(int argc, char **argv)
{
    return Wt::WRun(argc, argv, [](const Wt::WEnvironment& env) {
      return std::make_unique<WebTest::DebtNetworkApplication>(env);
    });
}
