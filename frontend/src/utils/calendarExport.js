/**
 * Calendar export utilities for generating .ics files and Google Calendar links.
 */

function formatDateToICS(date) {
  const d = typeof date === 'string' ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

function generateUID() {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}@govtexampath.com`;
}

/**
 * Generate and download a .ics calendar file.
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {Date|string} startDate - Event start date
 * @param {Date|string|null} endDate - Event end date (defaults to startDate)
 * @param {string|null} url - Optional URL to include in the event
 */
export function generateICSFile(title, description, startDate, endDate, url) {
  const start = formatDateToICS(startDate);
  // For all-day events, DTEND should be the next day
  const endD = endDate ? new Date(endDate) : new Date(startDate);
  endD.setDate(endD.getDate() + 1);
  const end = formatDateToICS(endD);

  const now = new Date();
  const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}T${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}Z`;

  // Escape special characters for ICS format
  const escDesc = (description || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  const escTitle = (title || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,');

  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//GovtExamPath//Exam Calendar//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${generateUID()}`,
    `DTSTAMP:${timestamp}`,
    `DTSTART;VALUE=DATE:${start}`,
    `DTEND;VALUE=DATE:${end}`,
    `SUMMARY:${escTitle}`,
    `DESCRIPTION:${escDesc}`,
  ];

  if (url) {
    icsContent.push(`URL:${url}`);
  }

  icsContent.push('END:VEVENT', 'END:VCALENDAR');

  const blob = new Blob([icsContent.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = `${title.replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '_').substring(0, 50)}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

/**
 * Open Google Calendar "create event" page in a new tab.
 * @param {string} title - Event title
 * @param {string} description - Event description
 * @param {Date|string} startDate - Event start date
 * @param {Date|string|null} endDate - Event end date (defaults to startDate)
 * @param {string|null} url - Optional URL to include in the description
 */
export function addToGoogleCalendar(title, description, startDate, endDate, url) {
  const start = formatDateToICS(startDate);
  const endD = endDate ? new Date(endDate) : new Date(startDate);
  endD.setDate(endD.getDate() + 1);
  const end = formatDateToICS(endD);

  const fullDescription = url ? `${description || ''}\n\nMore info: ${url}` : (description || '');

  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${start}/${end}`,
    details: fullDescription,
  });

  window.open(`https://calendar.google.com/calendar/render?${params.toString()}`, '_blank');
}
