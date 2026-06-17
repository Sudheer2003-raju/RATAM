const BACKEND_URL = getBackendUrl();

function getBackendUrl() {
	if (window.location.protocol === 'file:') {
		return 'http://localhost:5000/book';
	}
	const origin = window.location.origin;
	if (!origin || origin === 'null') {
		return 'http://localhost:5000/book';
	}
	return `${origin}/book`; 
}

const form = document.getElementById("appointmentForm");
if (!form) {
	console.error('Appointment form not found: #appointmentForm');
} else {
	const submitBtn = form.querySelector('button[type="submit"]');

	form.addEventListener("submit", async (e) => {
		e.preventDefault();

		const appointmentDateRaw = document.getElementById("appointmentDate").value.trim();
		const parsedDate = parseAppointmentDate(appointmentDateRaw);
		if (!parsedDate) {
			showMessage('Please enter a valid appointment date in DD/MM/YY format.');
			if (submitBtn) submitBtn.disabled = false;
			return;
		}

		const data = {
			name: document.getElementById("name").value,
			email: document.getElementById("email").value,
			phone: document.getElementById("phone").value,
			date: parsedDate.iso,
			service: document.getElementById("service").value,
			message: document.getElementById("message").value
		};

		try {
			const response = await fetch(BACKEND_URL, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(data)
			});

			if (!response.ok) {
				const text = await response.text().catch(() => null);
				throw new Error(text || `Request failed: ${response.status}`);
			}

			const result = await response.json();
			showMessage(result.message || "Appointment Submitted Successfully", 'success');
			form.reset();
		} catch (err) {
			console.error('Error sending appointment:', err);
			showMessage(`Failed to submit appointment. ${err.message || ''}`);
		} finally {
			if (submitBtn) submitBtn.disabled = false;
		}
	});
}

function parseAppointmentDate(value) {
	if (!value) return null;
	const parts = value.split(/[\/\-.\s]+/).map(part => part.trim());
	if (parts.length !== 3) return null;
	let [day, month, year] = parts;
	if (!/^\d{1,2}$/.test(day) || !/^\d{1,2}$/.test(month) || !/^\d{2,4}$/.test(year)) return null;
	day = day.padStart(2, '0');
	month = month.padStart(2, '0');
	year = year.length === 2 ? `20${year}` : year;
	const numericDay = Number(day);
	const numericMonth = Number(month);
	const numericYear = Number(year);
	const date = new Date(`${numericYear}-${month}-${day}`);
	if (Number.isNaN(date.getTime())) return null;
	if (date.getDate() !== numericDay || date.getMonth() + 1 !== numericMonth || date.getFullYear() !== numericYear) return null;
	return {
		iso: `${numericYear}-${month}-${day}`,
		display: `${day}/${month}/${String(numericYear).slice(-2)}`
	};
}

const appointmentInput = document.getElementById("appointmentDate");
if (appointmentInput) {
	appointmentInput.addEventListener('blur', () => {
		const parsed = parseAppointmentDate(appointmentInput.value.trim());
		if (parsed) appointmentInput.value = parsed.display;
	});
}

const presetButtons = document.querySelectorAll('.preset-btn');
if (presetButtons.length && appointmentInput) {
	presetButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const offset = Number(button.dataset.offset);
			if (!Number.isNaN(offset)) {
				appointmentInput.value = formatDateDisplay(offsetDate(offset));
				appointmentInput.focus();
			}
		});
	});
}

function offsetDate(days) {
	const date = new Date();
	date.setDate(date.getDate() + days);
	return date;
}

function formatDateDisplay(date) {
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = String(date.getFullYear()).slice(-2);
	return `${day}/${month}/${year}`;
}

// Message modal helpers
const messageModal = document.getElementById('messageModal');
const messageText = document.getElementById('messageText');
const messageIcon = document.getElementById('messageIcon');
const retryBtn = document.getElementById('retryBtn');
const openConsoleBtn = document.getElementById('openConsoleBtn');
const closeMsgBtn = document.getElementById('closeMsgBtn');

function showMessage(text, type = 'error'){
	if (!messageModal) {
		alert(text);
		return;
	}
	messageText.textContent = text;
	messageModal.classList.remove('hidden');
	messageModal.classList.toggle('success', type === 'success');
	messageModal.classList.toggle('error', type !== 'success');
	if (messageIcon) messageIcon.style.display = type === 'success' ? 'flex' : 'none';
	if (retryBtn) retryBtn.style.display = type === 'success' ? 'none' : 'inline-block';
	if (openConsoleBtn) openConsoleBtn.style.display = type === 'success' ? 'none' : 'inline-block';
	if (closeMsgBtn) closeMsgBtn.textContent = type === 'success' ? 'OK' : 'Close';
	if (type === 'success') {
		setTimeout(closeMessage, 4500);
	}
}

function closeMessage(){
	if (!messageModal) return;
	messageModal.classList.add('hidden');
}

if (retryBtn) retryBtn.addEventListener('click', () => {
	closeMessage();
	// trigger submit programmatically
	if (form) form.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
});

if (openConsoleBtn) openConsoleBtn.addEventListener('click', () => {
	// Can't open DevTools from JS; instruct the user instead
	showMessage('Press F12 or Ctrl+Shift+I to open the DevTools. Then retry.');
});

if (closeMsgBtn) closeMsgBtn.addEventListener('click', () => {
	closeMessage();
});