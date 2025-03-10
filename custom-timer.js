// document.addEventListener('DOMContentLoaded', function () {
//     document.getElementById('setTimer').addEventListener('click', function () {
//         const minutes = parseInt(document.getElementById('minutes').value);

//         if (isNaN(minutes) || minutes <= 0) {
//             alert('Please enter a valid number of minutes');
//             return;
//         }

//         // send message to background script
//         chrome.runtime.sendMessage({
//             action: 'setCustomTimer',
//             minutes: minutes
//         }, function (response) {
//             // close the popup after setting the timer
//             window.close();
//         });
//     });

//     // Add keyboard support (Enter key)
//     document.getElementById('minutes').addEventListener('keypress', function (event) {
//         if (event.key === 'Enter') {
//             document.getElementById('setTimer').click();
//         }
//     });
// })


document.addEventListener('DOMContentLoaded', function () {
    const minutesInput = document.getElementById('minutes');
    const setTimerBtn = document.getElementById('setTimer');
    const stopTimerBtn = document.getElementById('stopTimer');
    const messageEl = document.getElementById('message');
    const resetTimerBtn = document.getElementById('resetTimer');
    const quickTimerButtons = document.querySelectorAll('.quick-timer');

    // Quick timer button functionality
    quickTimerButtons.forEach(button => {
        button.addEventListener('click', function () {
            const minutes = this.textContent.replace('m', '');
            minutesInput.value = minutes;
            setTimerBtn.click();
        });
    });

    // Set timer button functionality
    setTimerBtn.addEventListener('click', function () {
        const minutes = parseInt(document.getElementById('minutes').value);
        if (isNaN(minutes) || minutes <= 0) {
            showMessage('Please enter a valid number of minutes', 'error');
            return;
        }
        chrome.runtime.sendMessage({ action: 'setCustomTimer', minutes: minutes }, function (response) {
            if (response.success) {
                showMessage(`Timer set for ${minutes} minutes`, 'success');

                setTimerBtn.style.display = 'none';
                stopTimerBtn.style.display = 'block';
                setTimeout(() => window.close(), 1000);
            }
        });
    });

    stopTimerBtn.addEventListener('click', function () {
        console.log("Stop button clicked");
        chrome.runtime.sendMessage({ action: 'stopTimer', minutes: minutes }, function (response) {
            console.log("Response received:", response);
            if (response && response.success) {

                stopTimerBtn.style.display = 'none';
                setTimerBtn.style.display = 'block';
            }
        });
    });
    resetTimerBtn.addEventListener('click', function () {
        chrome.runtime.sendMessage({ action: 'resetTimer' }, function (response) {
            if (response.success) {
                stopTimerBtn.style.display = 'none';
                setTimerBtn.style.display = 'block';
            }
        });
    });
    // Keyboard support (Enter key)
    minutesInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            setTimerBtn.click();
        }
    });
    // Initialize button states
    chrome.runtime.sendMessage({ action: 'getTimerStatus' }, function (response) {
        if (response.timerIsRunning) {
            setTimerBtn.style.display = 'none';
            stopTimerBtn.style.display = 'block';
        } else {
            stopTimerBtn.style.display = 'none';
            setTimerBtn.style.display = 'block';
        }
    });
});
// Message display function
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    const minutesInput = document.getElementById('minutes');
    messageEl.textContent = text;
    messageEl.classList.remove('text-red-600', 'text-green-600', 'opacity-0');

    if (type === 'error') {
        messageEl.classList.add('text-red-600');
        minutesInput.classList.add('border-red-500', 'animate-pulse-slow');
        setTimeout(() => {
            minutesInput.classList.remove('border-red-500', 'animate-pulse-slow');
        }, 1500);
    } else if (type === 'success') {
        messageEl.classList.add('text-green-600');
    }

    messageEl.classList.remove('opacity-0');
}