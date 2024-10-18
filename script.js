// script.js

function generateNameFields() {
    const participantsInput = document.getElementById('participants');
    const participants = parseInt(participantsInput.value);

    if (isNaN(participants) || participants <= 0) {
        alert('Please enter a valid number of participants.');
        return;
    }

    // Hide the initial input section
    document.getElementById('input-section').style.display = 'none';

    // Show the names input section
    const namesSection = document.getElementById('names-section');
    namesSection.style.display = 'block';

    const nameFieldsDiv = document.getElementById('name-fields');
    nameFieldsDiv.innerHTML = '';

    // Generate name input fields
    for (let i = 0; i < participants; i++) {
        const label = document.createElement('label');
        label.textContent = `Participant ${i + 1} : `;
        const input = document.createElement('input');
        input.type = 'text';
        input.required = true;
        input.className = 'participant-name';
        label.appendChild(input);
        nameFieldsDiv.appendChild(label);
    }
}

function calculate() {
    console.log("Calculate button clicked");

    // Retrieve days input
    const daysInput = document.getElementById('days');
    const days = parseInt(daysInput.value);

    if (isNaN(days) || days <= 0) {
        alert('Please enter a valid number of days.');
        return;
    }

    // Retrieve participant name inputs
    const participantNameInputs = document.getElementsByClassName('participant-name');
    if (participantNameInputs.length === 0) {
        console.error("No elements with class 'participant-name' found");
        alert('Please enter the names of participants.');
        return;
    }

    const participants = participantNameInputs.length;
    const total_pages = 604;

    const schedule = [];
    let currentPage = 1;

    // Distribute pages among participants
    const basePagesPerPerson = Math.floor(total_pages / participants);
    let remainingPages = total_pages % participants;

    for (let i = 0; i < participants; i++) {
        // Retrieve participant name and ensure it is not empty or undefined
        const nameInputValue = participantNameInputs[i].value.trim();
        const name = nameInputValue !== '' ? nameInputValue : `Participant ${i + 1}`;

        let pagesAssigned = basePagesPerPerson;
        if (remainingPages > 0) {
            pagesAssigned += 1;
            remainingPages -= 1;
        }

        const startPage = currentPage;
        const endPage = startPage + pagesAssigned - 1;

        // Calculate pages per day
        const basePagesPerDay = Math.floor(pagesAssigned / days);
        const extraPages = pagesAssigned % days;
        const pagesPerDay = basePagesPerDay + (extraPages > 0 ? 1 : 0);

        schedule.push({
            name: name,
            totalPages: pagesAssigned,
            startPage: startPage,
            endPage: endPage,
            pagesPerDay: pagesPerDay
        });

        currentPage = endPage + 1;
        console.log(`Pages assigned to ${name}:`, pagesAssigned);
    }

    // Retrieve current language
    const lang = document.documentElement.lang || 'en';

    // Retrieve custom title
    const customTitleInput = document.getElementById('table-title');
    const customTitle = customTitleInput.value.trim() || translations[lang].readingSchedule;

    // Calculate time frame
    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(startDate.getDate() + days - 1);

    const options = { year: 'numeric', month: 'long', day: 'numeric' };

    // Use the current language for date formatting
    const formattedStartDate = startDate.toLocaleDateString(lang, options);
    const formattedEndDate = endDate.toLocaleDateString(lang, options);

    // Display the custom title and time frame
    document.getElementById('custom-title').textContent = customTitle;
    document.getElementById('time-frame').textContent = translations[lang].fromTo
        .replace('{startDate}', formattedStartDate)
        .replace('{endDate}', formattedEndDate)
        .replace('{days}', days);

    console.log("Displaying schedule title and time frame");

    // Display the result
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = '';

    // Create a table to display the schedule
    const table = document.createElement('table');
    table.classList.add('table', 'table-bordered', 'table-striped', 'w-100'); // Add Bootstrap classes

    const thead = document.createElement('thead');
    thead.innerHTML = `
        <tr>
            <th>${translations[lang].participantName}</th>
            <th>${translations[lang].totalPages}</th>
            <th>${translations[lang].assignedPages}</th>
            <th>${translations[lang].pagesPerDay}</th>
        </tr>
    `;
    table.appendChild(thead);

    const tbody = document.createElement('tbody');

    schedule.forEach(item => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.totalPages}</td>
            <td>${item.startPage} - ${item.endPage}</td>
            <td>${item.pagesPerDay}</td>
        `;
        tbody.appendChild(row);
    });

    table.appendChild(tbody);
    resultDiv.appendChild(table);

    // Hide the names section and show the result section
    document.getElementById('names-section').style.display = 'none';
    document.getElementById('result-section').style.display = 'block';

    // Show the print and download buttons
    document.getElementById('print-button').style.display = 'inline-block';
    document.getElementById('download-button').style.display = 'inline-block';

    console.log("Schedule calculated and displayed");
}



function printSchedule() {
    window.print();
}

function downloadPDF() {
    // Use jsPDF to generate PDF
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const customTitle = document.getElementById('custom-title').textContent;
    const timeFrame = document.getElementById('time-frame').textContent;
    const resultDiv = document.getElementById('result');

    doc.setFontSize(18);
    doc.text(customTitle, 14, 22);
    doc.setFontSize(12);
    doc.text(timeFrame, 14, 30);

    // Convert the HTML table to PDF
    doc.autoTable({ html: resultDiv.querySelector('table'), startY: 40 });

    // Add footer with copyright
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(10);
        doc.text(`© mkante.ml`, doc.internal.pageSize.getWidth() / 2, doc.internal.pageSize.getHeight() - 10, { align: 'center' });
    }

    doc.save('reading_schedule.pdf');
}

function goHome() {
    // Hide the result section and reset the table content
    document.getElementById('result-section').style.display = 'none';
    document.getElementById('result').innerHTML = '';

    // Show the initial input section again
    document.getElementById('input-section').style.display = 'block';

    // Reset the participants input and days input fields
    document.getElementById('participants').value = '';
    document.getElementById('days').value = '';

    // Hide the names section and clear the name input fields
    document.getElementById('names-section').style.display = 'none';
    document.getElementById('name-fields').innerHTML = '';

    // Hide the print and download buttons
    document.getElementById('print-button').style.display = 'none';
    document.getElementById('download-button').style.display = 'none';
    
    console.log("Home button clicked, resetting form");
}

