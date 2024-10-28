export default function convertTimeToDuration(timeString) {
  // Split the time string into hours, minutes, and seconds
  const [hours, minutes, seconds] = timeString.split(':').map(Number);

  // Calculate the total minutes
  const totalMinutes = hours * 60 + minutes + Math.round(seconds / 60);

  // Calculate the hours and minutes for the output
  const outputHours = Math.floor(totalMinutes / 60);
  const outputMinutes = Math.floor(totalMinutes % 60);

  // Construct the duration string
  const duration = `${outputHours}h ${outputMinutes}m`;

  return duration;
}

