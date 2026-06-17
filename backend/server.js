const express = require("express");
const nodemailer = require("nodemailer");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Read credentials from environment variables. If an app-password
// was pasted in groups (e.g. "xxxx yyyy zzzz aaaa"), strip spaces.
const EMAIL_USER = process.env.EMAIL_USER || "psudheer231103@gmail.com";
const EMAIL_PASS = (process.env.EMAIL_PASS || "gjez ognm deok crvu").replace(/\s/g, "");

const transporter = nodemailer.createTransport({
	service: "gmail",
	auth: {
		user: EMAIL_USER,
		pass: EMAIL_PASS
	}
});

function formatAppointmentDate(value) {
	if (!value) return "Not specified";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return value;
	const day = String(date.getDate()).padStart(2, '0');
	const month = String(date.getMonth() + 1).padStart(2, '0');
	const year = date.getFullYear();
	return `${day}/${month}/${year}`;
}

app.post("/book", async (req, res) => {

const { name, email, phone, date, service, message } = req.body;
const formattedDate = formatAppointmentDate(date);

try {

await transporter.sendMail({

from: email,

to: "naraharibackup3@gmail.com",

subject: "New Appointment Request",

html: `
<h2>Appointment Booking</h2>

<p><b>Name:</b> ${name}</p>
<p><b>Email:</b> ${email}</p>
<p><b>Phone:</b> ${phone}</p>
<p><b>Date:</b> ${formattedDate}</p>
<p><b>Service:</b> ${service}</p>
<p><b>Message:</b> ${message}</p>
`

});

res.json({
message:"Appointment Submitted Successfully"
});

}
catch(error){

console.log(error);

res.status(500).json({
message:"Email Sending Failed"
});

}

});

app.listen(5000, () => {
console.log("Server Running on Port 5000");
});

// Test endpoint to send a sample appointment email (no body required)
app.post("/test-send", async (req, res) => {
	const sample = {
		name: "Test User",
		email: EMAIL_USER,
		phone: "0000000000",
		date: new Date().toISOString(),
		service: "Test Service",
		message: "This is a test appointment email."
	};

	const formattedDate = formatAppointmentDate(sample.date);

	try {
		await transporter.sendMail({
			from: EMAIL_USER,
			to: "naraharibackup3@gmail.com",
			subject: "Test Appointment Email",
			html: `
				<h2>Appointment Booking (Test)</h2>
				<p><b>Name:</b> ${sample.name}</p>
				<p><b>Email:</b> ${sample.email}</p>
				<p><b>Phone:</b> ${sample.phone}</p>
				<p><b>Date:</b> ${formattedDate}</p>
				<p><b>Service:</b> ${sample.service}</p>
				<p><b>Message:</b> ${sample.message}</p>
			`
		});

		res.json({ message: "Test email sent" });
	} catch (error) {
		console.error("Test send failed:", error);
		res.status(500).json({ message: "Test email sending failed", error: error && error.message });
	}
});