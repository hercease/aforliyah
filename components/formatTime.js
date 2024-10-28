export default function ExtractTime(dateString) {
    const date = new Date(dateString);

    // Format the time part
    const timeOptions = {
        hour: 'numeric',  // '14'
        minute: 'numeric', // '20'
        hour12: false      // 24-hour format
    };
    let formattedTime = new Intl.DateTimeFormat('en-US', timeOptions).format(date);

    // Manually append 'pm' or 'am' to the 24-hour format
	const hours = date.getHours();
    if (hours >= 12) {
        formattedTime += 'pm';
    } else {
        formattedTime += 'am';
    }


    return formattedTime;
}
