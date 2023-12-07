
const TIME_MINUTE       = 60;
const TIME_HOUR         = 3600;
const TIME_DAY          = 86400;
const TIME_WEEK         = 604800;
const TIME_28_DAYS      = 2419200;
const TIME_31_DAYS      = 2678400;
const TIME_365_DAYS     = 31536000;

/**
 * *
 * @param {Date} date - Date object to get the relative time from
 */
export default function getRelativeTime(date) {
    let currDate = new Date();
    let currTime = currDate.getTime() / 1000 + currDate.getTimezoneOffset() * TIME_MINUTE;
    let relativeTime = date.getTime() / 1000;

    let timeDiff = currTime - relativeTime;
    let negative = timeDiff < 0;
    timeDiff = Math.abs(timeDiff);

    let outputString = "";

    if (timeDiff < 30) {
        return "just now";
    }

    if (timeDiff < TIME_MINUTE) {
        let diff = parseInt(timeDiff);
        outputString = diff + (diff == 1 ? " second " : " seconds ");
    }
    else if (timeDiff < TIME_HOUR) {
        let diff = parseInt(timeDiff / TIME_MINUTE)
        outputString = diff + (diff == 1 ? " minute " : " minutes ");
    }
    else if (timeDiff < TIME_DAY) {
        let diff = parseInt(timeDiff / TIME_HOUR)
        outputString = diff + (diff == 1 ? " hour " : " hours ");
    }
    else if (timeDiff < TIME_WEEK) {
        let diff = parseInt(timeDiff / TIME_DAY)
        outputString = diff + (diff == 1 ? " day " : " days ");
    }
    else if (timeDiff < TIME_28_DAYS) {
        let diff = parseInt(timeDiff / TIME_WEEK)
        outputString = diff + (diff == 1 ? " week " : " weeks ");
    }
    else if (timeDiff < TIME_365_DAYS) {
        let mult = negative ? -1 : 1;
        if (timeDiff > TIME_31_DAYS || (currDate.getUTCDate() - date.getUTCDate()) * mult >= 0) {
            let diff = parseInt((currDate.getUTCMonth() - date.getUTCMonth()) * mult);
            if (diff < 0) diff += 12;
            outputString = diff + (diff == 1 ? " month " : " months ");
        } else {

            let diff = parseInt(timeDiff / TIME_WEEK)
            outputString = diff + (diff == 1 ? " week " : " weeks ");
        }
        
    }
    else {
        let diff = parseInt(timeDiff / TIME_365_DAYS)
        outputString = diff + (diff == 1 ? " year " : " years ");
    }

    outputString += (negative ? "from now" : "ago");
    return outputString;

}