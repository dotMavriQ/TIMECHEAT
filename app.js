document.addEventListener('DOMContentLoaded', function() {
    const printButton = document.getElementById('print');
    const resultDiv = document.getElementById('result');
    const clipboardMessage = document.getElementById('clipboardMessage');
    const yearSelect = document.getElementById('year');
    const monthSelect = document.getElementById('month');
    const holidayAreaSelect = document.getElementById('holidayArea');
  
    printButton.addEventListener('click', async function() {
      // Clear previous results
      resultDiv.innerHTML = '';
  
      const year = parseInt(yearSelect.value, 10);
      const month = parseInt(monthSelect.value, 10);
      const holidayArea = holidayAreaSelect.value;
  
      // Build the date range for the chosen month
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
  
      // Convert to YYYY-MM-DD strings
      const validFrom = startOfMonth.toISOString().split('T')[0];
      const validTo = endOfMonth.toISOString().split('T')[0];
  
      // Build the OpenHolidaysAPI URL
      const apiUrl = `https://openholidaysapi.org/Holidays/PublicHolidays?countryIsoCode=PT&validFrom=${validFrom}&validTo=${validTo}&languageIsoCode=PT`;
  
      try {
        // Fetch the holiday data
        const response = await fetch(apiUrl, { headers: { accept: 'application/json' } });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const allHolidays = await response.json();
  
        // Filter to get only relevant holidays for Lisbon or Setubal (or nationwide)
        const relevantHolidays = filterHolidaysForArea(allHolidays, holidayArea);
  
        // Convert them to a Set of date strings (YYYY-MM-DD)
        const holidayDates = new Set(relevantHolidays.map(h => h.startDate));
  
        // Generate output for each day in the chosen month
        const daysInMonth = endOfMonth.getDate();
        for (let day = 1; day <= daysInMonth; day++) {
          // Construct date as YYYY-MM-DD
          const dayStr = String(day).padStart(2, '0');
          const monthStr = String(month).padStart(2, '0');
          const yyyymmdd = `${year}-${monthStr}-${dayStr}`;
  
          // Build display string in "Weekday, DD-MM-YYYY" format
          const dateFormat = `${dayStr}-${monthStr}-${year}`;
          const jsDate = new Date(year, month - 1, day);
          const weekday = jsDate.toLocaleString('en-US', { weekday: 'long' });
  
          let label = `${weekday}, ${dateFormat}`;
  
          // Mark weekend or holiday
          if (isWeekend(jsDate)) {
            label += ' (weekend)';
          } else if (holidayDates.has(yyyymmdd)) {
            label += ' (holiday!)';
          }
  
          // Append line to the result
          resultDiv.innerHTML += `<div>${label}</div>`;
        }
  
        // Copy results to clipboard
        const resultText = resultDiv.innerText;
        navigator.clipboard.writeText(resultText)
          .then(() => {
            console.log('Results copied to clipboard!');
            // Show the success message
            clipboardMessage.textContent = 'Copied to Clipboard!';
            clipboardMessage.classList.remove('hidden');
  
            // Optionally hide after 3 seconds
            setTimeout(() => {
              clipboardMessage.classList.add('hidden');
              clipboardMessage.textContent = '';
            }, 3000);
          })
          .catch(err => {
            console.error('Failed to copy results: ', err);
          });
  
      } catch (error) {
        resultDiv.innerHTML = `<div>Ocorreu um erro: ${error.message}</div>`;
      }
    });
  });
  
  /**
   * Returns holidays that are either nationwide or belong to the local area (Lisbon/Setubal).
   */
  function filterHolidaysForArea(holidays, area) {
    // The actual codes for local subdivisions come from the API’s "subdivisions" array. 
    // For example: 
    //  - Lisbon might be "PT-LI-LI"
    //  - Setubal might be "PT-SE-SE"
    // Adjust if necessary based on real data from the API.
    const SUBDIVISION_CODES = {
      lisbon: 'PT-LI-LI',
      setubal: 'PT-SE-SE',
    };
  
    const codeToMatch = SUBDIVISION_CODES[area];
  
    return holidays.filter(h => {
      // If the holiday is nationwide, it applies to everyone
      if (h.nationwide) {
        return true;
      }
      // If the holiday is local, check if subdivisions match codeToMatch
      if (Array.isArray(h.subdivisions) && codeToMatch) {
        return h.subdivisions.some(sub => sub.code === codeToMatch);
      }
      return false;
    });
  }
  
  /**
   * Checks if date is Saturday (6) or Sunday (0).
   */
  function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }
  