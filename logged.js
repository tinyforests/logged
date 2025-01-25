// logged.js

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const logButton = document.getElementById('logButton');
    const activityLog = document.getElementById('activityLog');

    logButton.addEventListener('click', logGeolocation);

    function logGeolocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const timestamp = new Date().toISOString();

                    // Log to the activity log
                    const logEntry = document.createElement('div');
                    logEntry.textContent = `${timestamp}: Lat ${latitude}, Lng ${longitude}`;
                    activityLog.appendChild(logEntry);

                    // Log to the RSS feed
                    addToRSSFeed(timestamp, latitude, longitude);
                },
                (error) => {
                    console.error('Error getting geolocation:', error);
                    alert('Unable to retrieve location. Please check your permissions.');
                }
            );
        } else {
            alert('Geolocation is not supported by your browser.');
        }
    }

    function addToRSSFeed(timestamp, latitude, longitude) {
        const rssFeed = document.getElementById('rssFeed');
        const rssEntry = document.createElement('item');

        const title = document.createElement('title');
        title.textContent = `Location Logged at ${timestamp}`;

        const description = document.createElement('description');
        description.textContent = `Latitude: ${latitude}, Longitude: ${longitude}`;

        const pubDate = document.createElement('pubDate');
        pubDate.textContent = new Date(timestamp).toUTCString();

        rssEntry.appendChild(title);
        rssEntry.appendChild(description);
        rssEntry.appendChild(pubDate);

        rssFeed.appendChild(rssEntry);
    }
});
