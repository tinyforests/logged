// logged.js

// Initialize the app when the document is ready
document.addEventListener('DOMContentLoaded', () => {
    const logButton = document.getElementById('logButton');
    const activityLog = document.getElementById('activityLog');
    const rssLink = document.getElementById('rssLink');

    logButton.addEventListener('click', logGeolocation);
    rssLink.addEventListener('click', downloadRSSFeed);

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

    function downloadRSSFeed() {
        const rssFeed = document.getElementById('rssFeed');
        const xmlContent = `<?xml version="1.0" encoding="UTF-8" ?>\n<rss version="2.0">\n<channel>\n<title>Geolocation RSS Feed</title>\n<link>${window.location.href}</link>\n<description>Logged geolocations</description>\n${rssFeed.innerHTML}\n</channel>\n</rss>`;

        const blob = new Blob([xmlContent], { type: 'application/rss+xml' });
        const url = URL.createObjectURL(blob);

        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = 'geolocation_feed.xml';
        downloadLink.click();

        URL.revokeObjectURL(url);
    }
});
