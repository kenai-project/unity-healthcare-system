# Unity Healthcare System

This project is a modern React + Node.js full-stack application for the Unity Hospital Healthcare System. It is a conversion from a static web app originally implemented with HTML, CSS, and vanilla JavaScript using localStorage.

## Project Structure

- **Frontend:** React app created with Vite
  - Components organized under `src/components/`
  - Pages organized under `src/pages/`
  - Global styles in `src/style.css` and custom fixes in `src/custom-fixes.css`
  - Routing handled by React Router

- **Backend:** Node.js (optional for future use)
  - Express server setup for API endpoints (to be implemented)

## Features

- User authentication (login, registration)
- Appointment booking with validation and conflict checking
- Dashboard for patients and doctors
- Responsive UI with smooth scrolling navigation
- LocalStorage persistence for demo purposes

## Setup Instructions

### Frontend

1. Navigate to the frontend directory:
   ```bash
   cd unity-healthcare-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to `http://localhost:5173`

### Backend (Optional)

1. Navigate to the backend directory (to be created):
   ```bash
   cd unity-healthcare-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the server:
   ```bash
   node index.js
   ```

## Testing

- Test navigation links, form inputs, and buttons on all pages.
- Verify login, registration, and appointment booking flows.
- Check dashboard views for patients and doctors.
- Ensure responsive design on different screen sizes.

## Future Improvements

- Implement backend API with database integration (MongoDB/PostgreSQL).
- Add authentication tokens and secure session management.
- Enhance UI/UX with animations and accessibility improvements.
- Add unit and integration tests.

## License

MIT License

---

This README provides an overview and instructions to get started with the Unity Healthcare System React + Node.js app.
