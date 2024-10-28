export default function ExtractDate(dateString) {
    const date = new Date(dateString);

    // Format the date part
    const dateOptions = {
        month: 'short',  // 'Aug'
        day: 'numeric',  // '19'
        year: 'numeric', // '2024'
    };
    let formattedDate = new Intl.DateTimeFormat('en-US', dateOptions).format(date);


    return formattedDate;
}
