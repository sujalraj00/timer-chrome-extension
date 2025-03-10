// function createContextMenus(){

// }.
let seconds = 25 * 60;
let timerIsRunning = false;
chrome.alarms.onAlarm.addListener((alarm) => {

    if (!timerIsRunning) {
        return;
    }
    seconds--;

    const minLeft = Math.floor(seconds / 60) + "M";
    chrome.action.setBadgeText({ text: minLeft }, () => { });

    if (seconds <= 0) {
        clearAlarm('screen-timer');
        createNotification("Well done! You focused well, Take a break");
        chrome.contextMenus.update("start-timer", {
            title: "Start Timer",
            contexts: ["all"]
        });
        chrome.action.setBadgeText({ text: "-" }, () => { });

        chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => { });
        timerIsRunning = false;
    }
});

function createAlarm(name) {
    chrome.alarms.create(
        name,
        {
            periodInMinutes: 1 / 60
        },
    )
}

function clearAlarm(name) {
    chrome.alarms.clear(
        name,
        (wasCleared) => {
            console.log("Alarm was cleared: " + wasCleared);
        }
    );
}

function createNotification(message) {

    const opt = {
        type: 'list',
        title: 'Screen Timer',
        message,
        items: [{ title: 'Screen Timer', message: message }],
        iconUrl: "icons/time-6-48.png"
    }

    chrome.notifications.create(opt)
}

chrome.contextMenus.create({
    id: "start-timer",
    title: "Start Timer",
    contexts: ["all"]
});
chrome.contextMenus.create({
    id: "reset-timer",
    title: "Reset Timer",
    contexts: ["all"]
});

chrome.contextMenus.create({
    id: "custom-timer",
    title: "Set Custom Timer",
    contexts: ["all"]
});

// add timer duration options
const timerOptions = [5, 10, 15, 20, 25, 30, 45, 60, 90, 120];
timerOptions.forEach(minutes => {
    chrome.contextMenus.create({
        id: `set-timer-${minutes}`,
        title: `${minutes} minutes`,
        parentId: "custom-timer",
        contexts: ["all"]
    });
});

// add custom input option
chrome.contextMenus.create({
    id: "custom-timer-input",
    title: "Custom...",
    parentId: "custom-timer",
    contexts: ["all"]
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    switch (info.menuItemId) {

        case "reset-timer":
            chrome.contextMenus.update("start-timer", {

                title: "Start Timer",
                contexts: ["all"]
            })
            chrome.action.setBadgeText({ text: "R" }, () => { });
            clearAlarm("screen-timer");
            chrome.action.setBadgeBackgroundColor({ color: "green" }, () => { });
            createNotification("Your Timer has been reset");
            timerIsRunning = false;
            seconds = 0;
            break;


        case "start-timer":
            if (timerIsRunning) {
                //clearAlarm("screen-timer");
                createNotification("Your Timer has stopped");
                chrome.contextMenus.update("start-timer", {

                    title: "Start Timer",
                    contexts: ["all"]
                })
                timerIsRunning = false;
                chrome.action.setBadgeText({ text: "S" }, () => { });

                chrome.action.setBadgeBackgroundColor({ color: "yellow" }, () => { });
                return;
            }

            seconds = seconds <= 0 ? 25 * 60 : seconds;

            createNotification("Your Timer has started");
            timerIsRunning = true;
            createAlarm("screen-timer");
            chrome.action.setBadgeBackgroundColor({ color: "red" }, () => { });
            chrome.contextMenus.update("start-timer", {

                title: "Stop Timer",
                contexts: ["all"]
            });
            break;

        case "custom-timer-input":
            // show popup to get custom input
            chrome.windows.create({
                url: 'popup.html',
                type: 'popup',
                width: 300,
                height: 200
            });

            // if (info.menuItemId.startsWith('custom-timer-input')) {
            //     const minutes = parseInt(info.menuItemId.replace('custom-timer-input', ''));
            //     seconds = minutes * 60;
            //     createNotification("Your Timer has started");
            //     timerIsRunning = true;
            //     createAlarm("screen-timer");
            //     chrome.action.setBadgeBackgroundColor({ color: "red" }, () => { });
            //     chrome.contextMenus.update("start-timer", {

            //         title: "Stop Timer",
            //         contexts: ["all"]
            //     });
            // }
            break;

        default:

            // check if it's one of the present timer option 
            if (info.menuItemId.startsWith('set-timer-')) {
                const minutes = parseInt(info.menuItemId.replace('set-timer-', ''));
                if (!isNaN(minutes)) {
                    seconds = minutes * 60;
                    chrome.action.setBadgeText({ text: minutes + "M" }, () => { });
                    chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => { });
                    createNotification(`Timer set to ${minutes} minutes`);


                    //   createNotification("Your Timer has started");
                    timerIsRunning = true;
                    createAlarm("screen-timer");
                    chrome.action.setBadgeBackgroundColor({ color: "red" }, () => { });
                    chrome.contextMenus.update("start-timer", {

                        title: "Stop Timer",
                        contexts: ["all"]
                    });

                }
            }
            break;
    }
});

// listen for message from the popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'setCustomTimer') {
        const minutes = request.minutes;
        if (minutes > 0) {
            seconds = minutes * 60;
            chrome.action.setBadgeText({ text: minutes + "M" }, () => { });
            // chrome.action.setBadgeBackgroundColor({ color: "blue" }, () => { });
            createNotification(`Timer set to ${minutes} minutes`);
            //  createNotification("Your Timer has started");
            timerIsRunning = true;
            createAlarm("screen-timer");
            chrome.action.setBadgeBackgroundColor({ color: "red" }, () => { });
            chrome.contextMenus.update("start-timer", {

                title: "Stop Timer",
                contexts: ["all"]
            });

        }
    }
    sendResponse({ success: true });
    return true;
})


// chrome.runtime.onInstalled.addListener(function (details) {
//     if (details.reason == "install") {
//         //  createContextMenus();


//     }
// });



chrome.action.setBadgeBackgroundColor({ color: [255, 0, 0, 255] },
    () => { }
);