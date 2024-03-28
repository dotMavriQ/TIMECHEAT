document.getElementById('print').addEventListener('click', function() {
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const holidayArea = document.getElementById('holidayArea').value;
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = ''; // Clear previous results

    const holidays = {
        'lisbon': {
            '1/1': 'New Year\'s Day',
            '2/13': 'Carnival',
            '3/29': 'Good Friday',
            '4/25': 'Freedom Day',
            '5/1': 'Labour Day',
            '5/30': 'Corpus Christi',
            '6/10': 'Portugal Day',
            '6/13': 'Saint Anthony\'s Day',
            '8/15': 'Assumption of Mary',
            '11/1': 'All Saints\' Day',
            '12/25': 'Christmas Day',
        },
        'setubal': {
            '1/1': 'New Year\'s Day',
            '2/13': 'Carnival',
            '3/29': 'Good Friday',
            '4/25': 'Freedom Day',
            '5/1': 'Labour Day',
            '5/30': 'Corpus Christi',
            '6/10': 'Portugal Day',
            '8/15': 'Assumption of Mary',
            '11/1': 'All Saints\' Day',
            '12/25': 'Christmas Day',
            // Specific for Setubal
            '9/15': 'Bocage Day',
        }
    };

    // Helper function to check if a date is a weekend
    function isWeekend(date) {
        return date.getDay() === 0 || date.getDay() === 6; // Sunday = 0, Saturday = 6
    }

    // Generate dates for the selected month
    const daysInMonth = new Date(year, month, 0).getDate();
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month - 1, day); // JS months start at 0
        const dateFormat = `${('0' + day).slice(-2)}-${('0' + month).slice(-2)}-${year}`;
        const weekDay = date.toLocaleString('en-US', { weekday: 'long' });

        let label = `${weekDay}, ${dateFormat}`;
        if (isWeekend(date)) {
            label += ' (weekend)';
        } else if (holidays[holidayArea][`${month}/${day}`]) {
            label += ' (holiday!)';
        }

        resultDiv.innerHTML += `<div>${label}</div>`;
    }

    // Copy results to clipboard
    const resultText = resultDiv.innerText;
    navigator.clipboard.writeText(resultText).then(() => {
        console.log('Results copied to clipboard!');
    }).catch(err => {
        console.error('Failed to copy results: ', err);
    });
});
