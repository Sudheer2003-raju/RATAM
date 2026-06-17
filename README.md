# Ratam Consultancy Website

This project contains a static front-end and a Node.js/Express backend that sends appointment emails using Nodemailer.

## Project Structure

- `index.html` - main website page
- `style.css` - styling
- `script.js` - client-side booking form logic
- `backend/server.js` - Express server and email sending
- `backend/package.json` - backend dependencies and start script
- `backend/.env.example` - example environment variables for email configuration

## Local setup

1. Install backend dependencies:

```powershell
cd backend
npm install
```

2. Create a `.env` file inside `backend` using `backend/.env.example` as a template.

3. Start the backend server:

```powershell
cd backend
npm start
```

4. Serve the front-end files from the root folder, for example:

```powershell
cd ..
python -m http.server 5500
```

5. Open the website at:

```text
http://localhost:5500
```

## Deployment notes

- The frontend now auto-detects the backend URL and will default to the same origin when deployed together.
- If the frontend is served from a different host than the backend, the form will still attempt `http://localhost:5000/book` for local testing.
- Make sure to set the following environment variables in production on the backend server:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-gmail-app-password
```

- If you use Gmail, use an App Password and do not rely on your normal account password.

## Running in production

The backend can be started with:

```powershell
cd backend
npm start
```

If the frontend and backend are served from the same host, no additional configuration is required.

## Notes

- The appointment form accepts dates in `DD/MM/YY` format.
- A contact footer and floating icons for WhatsApp, email, and phone are included.
