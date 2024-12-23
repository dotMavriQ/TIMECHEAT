document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('print').addEventListener('click', async function() {
      const year = parseInt(document.getElementById('year').value, 10);
      const month = parseInt(document.getElementById('month').value, 10);
      const holidayArea = document.getElementById('holidayArea').value;
      const resultDiv = document.getElementById('result');
      resultDiv.innerHTML = ''; // Clear previous results
  
      // 1. Compute validFrom/validTo for the API request (still used to limit the data).
      const startOfMonth = new Date(year, month - 1, 1);
      const endOfMonth = new Date(year, month, 0);
      const validFrom = startOfMonth.toISOString().split('T')[0]; // "YYYY-MM-DD"
      const validTo = endOfMonth.toISOString().split('T')[0];     // "YYYY-MM-DD"
  
      // 2. Fetch the *entire* holiday list (nationwide + local)
      const apiUrl = `https://openholidaysapi.org/Holidays/PublicHolidays?` +
        `countryIsoCode=PT&validFrom=${validFrom}&validTo=${validTo}&languageIsoCode=PT`;
  
      let allHolidays = [];
      try {
        const response = await fetch(apiUrl, { headers: { accept: 'application/json' } });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        allHolidays = await response.json();
      } catch (error) {
        resultDiv.innerHTML = `<div>Ocorreu um erro: ${error.message}</div>`;
        return;
      }
  
      // 3. Filter the holidays by area (nationwide or local to Lisbon/Setubal)
      const relevantHolidays = filterHolidaysForArea(allHolidays, holidayArea);
  
      // 4. Convert them to a Set of date strings (YYYY-MM-DD)
      const holidayDates = new Set(relevantHolidays.map(h => h.startDate));
  
      // 5. Loop over each day of the month, building a pure date string for comparison
      const daysInMonth = endOfMonth.getDate();
      for (let day = 1; day <= daysInMonth; day++) {
        // Build the local "YYYY-MM-DD" string
        const dayStr = String(day).padStart(2, '0');
        const monthStr = String(month).padStart(2, '0');
        const yyyymmdd = `${year}-${monthStr}-${dayStr}`;
  
        // For display, we keep your old format: "Weekday, DD-MM-YYYY"
        const dateFormat = `${dayStr}-${monthStr}-${year}`;
        const jsDate = new Date(year, month - 1, day);
        const weekDay = jsDate.toLocaleString('en-US', { weekday: 'long' });
  
        let label = `${weekDay}, ${dateFormat}`;
  
        // Check if weekend
        if (isWeekend(jsDate)) {
          label += ' (weekend)';
        } 
        // Check if holiday
        else if (holidayDates.has(yyyymmdd)) {
          label += ' (holiday!)';
        }
  
        resultDiv.innerHTML += `<div>${label}</div>`;
      }
  
      // 6. Copy results to clipboard
      const resultText = resultDiv.innerText;
      navigator.clipboard.writeText(resultText)
        .then(() => console.log('Results copied to clipboard!'))
        .catch(err => console.error('Failed to copy results: ', err));
    });
  });
  
  /**
   * Example filter function to keep holidays that are either nationwide or match the local code.
   */
  function filterHolidaysForArea(holidays, area) {
    // The actual codes in the 'subdivisions' array might vary.
    // For example, 'PT-SE-SE' for Setúbal, 'PT-LI-LI' for Lisbon (or something similar).
    // Adjust as needed based on your actual API data for municipal codes.
    const SUBDIVISION_CODES = {
      lisbon: 'PT-LI-LI',   // Example
      setubal: 'PT-SE-SE'  // Example
    };
  
    const codeToMatch = SUBDIVISION_CODES[area];
  
    return holidays.filter(h => {
      // If nationwide, it's valid for everyone
      if (h.nationwide) {
        return true;
      }
      // If not nationwide, check if the holiday's subdivisions array includes the local code
      if (Array.isArray(h.subdivisions) && codeToMatch) {
        return h.subdivisions.some(sub => sub.code === codeToMatch);
      }
      return false;
    });
  }
  
  /**
   * Checks if a date is Saturday (6) or Sunday (0).
   */
  function isWeekend(date) {
    return date.getDay() === 0 || date.getDay() === 6;
  }
  