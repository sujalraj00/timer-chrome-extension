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
    const messageEl = document.getElementById('message');
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
        const minutes = parseInt(minutesInput.value);

        if (isNaN(minutes) || minutes <= 0) {
            showMessage('Please enter a valid number of minutes', 'error');
            return;
        }

        // Send message to background script
        chrome.runtime.sendMessage({
            action: 'setCustomTimer',
            minutes: minutes
        }, function (response) {
            if (response.success) {
                showMessage(`Timer set for ${minutes} minutes`, 'success');
                setTimeout(() => window.close(), 1000);
            }
        });
    });

    // Keyboard support (Enter key)
    minutesInput.addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            setTimerBtn.click();
        }
    });

    // Message display function
    function showMessage(text, type) {
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
});