// Reminder management logic for MyHealth Reminder
// Now uses localStorage for data persistence

document.addEventListener('DOMContentLoaded', function() {
    const reminderForm = document.getElementById('reminder-form');
    const remindersList = document.getElementById('reminders-list');

    // Fetch and display reminders on load
    fetchReminders();

    // Add new reminder
    function handleAddReminder(e) {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value.trim();
        const dateTime = document.getElementById('dateTime').value;
        const notes = document.getElementById('notes').value.trim();
        if (!taskName || !dateTime) {
            alert('Please fill in all required fields.');
            return;
        }
        const reminders = getReminders();
        const id = Date.now().toString();
        reminders.push({ id, taskName, dateTime, notes, createdAt: new Date().toISOString() });
        saveReminders(reminders);
        reminderForm.reset();
        fetchReminders();
    }
    reminderForm.addEventListener('submit', handleAddReminder);

    // Fetch reminders from localStorage and display
    function fetchReminders() {
        const reminders = getReminders().sort((a, b) => new Date(a.dateTime) - new Date(b.dateTime));
        remindersList.innerHTML = '';
        const now = new Date();
        reminders.forEach(reminder => {
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${reminder.taskName}</strong>
                <span>${formatDateTime(reminder.dateTime)}</span>
                ${reminder.notes ? `<em>${reminder.notes}</em>` : ''}
                <div class="reminder-actions">
                    <button onclick="editReminder('${reminder.id}')">Edit</button>
                    <button onclick="deleteReminder('${reminder.id}')">Delete</button>
                </div>
            `;
            remindersList.appendChild(li);
            // Set up notification if time is in the future
            const reminderTime = new Date(reminder.dateTime);
            if (reminderTime > now) {
                scheduleNotification(reminder.taskName, reminderTime);
            }
        });
    }

    // Format date and time for display
    function formatDateTime(dt) {
        const d = new Date(dt);
        return d.toLocaleString();
    }

    // Schedule in-browser notification
    function scheduleNotification(task, time) {
        const now = new Date();
        const ms = time - now;
        if (ms > 0 && ms < 2147483647) { // setTimeout max
            setTimeout(() => {
                alert(`Reminder: ${task}`);
            }, ms);
        }
    }

    // LocalStorage helpers
    function getReminders() {
        return JSON.parse(localStorage.getItem('reminders') || '[]');
    }
    function saveReminders(reminders) {
        localStorage.setItem('reminders', JSON.stringify(reminders));
    }

    // Expose edit/delete globally for inline buttons
    window.editReminder = function(id) {
        const reminders = getReminders();
        const reminder = reminders.find(r => r.id === id);
        if (reminder) {
            document.getElementById('taskName').value = reminder.taskName;
            document.getElementById('dateTime').value = reminder.dateTime;
            document.getElementById('notes').value = reminder.notes || '';
            reminderForm.removeEventListener('submit', handleAddReminder);
            reminderForm.onsubmit = function(e) {
                e.preventDefault();
                reminder.taskName = document.getElementById('taskName').value.trim();
                reminder.dateTime = document.getElementById('dateTime').value;
                reminder.notes = document.getElementById('notes').value.trim();
                saveReminders(reminders);
                reminderForm.reset();
                reminderForm.onsubmit = null;
                reminderForm.addEventListener('submit', handleAddReminder, { once: true });
                fetchReminders();
            };
        }
    };

    window.deleteReminder = function(id) {
        if (confirm('Delete this reminder?')) {
            let reminders = getReminders();
            reminders = reminders.filter(r => r.id !== id);
            saveReminders(reminders);
            fetchReminders();
        }
    };
});