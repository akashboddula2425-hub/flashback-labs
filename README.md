# flashback-labs
 FlashbackAuth – OTP Login + Liveness Check + Selfie Upload 📌 Overview FlashbackAuth is a React Native mobile application that implements a secure login process using OTP verification, on-device liveness detection, and selfie upload to a backend API.

🚀 Features OTP Authentication Send OTP via WhatsApp using backend API. Verify OTP with proper error handling. Liveness Detection Uses front camera only. Runs fully on-device (no paid SDKs). Selfie Capture & Upload Captures selfie after liveness check passes. Uploads to backend with JWT authentication. User-Friendly Responsive UI for all screen sizes. Clear instructions and error messages. 🛠 Tech Stack React Native CLI – Mobile app framework React Navigation – Screen navigation Axios – API calls React Native Camera / Expo Camera – Camera access FormData – File uploads
App Architecture Overview
Frontend: The frontend is built with React 18 and TypeScript, using Vite for the development and build processes. Wouter handles client-side routing, while TanStack Query manages server state. The UI is styled using Tailwind CSS with components from the shadcn/ui library, which is built on Radix UI primitives.

Backend: The backend is a Node.js server using Express.js. It provides RESTful endpoints for session management and integrates a Vite middleware for hot module replacement during development. The database is a PostgreSQL instance accessed via the Drizzle ORM.

Authentication Flow: The application uses external APIs from Flashback for OTP delivery via WhatsApp and selfie uploads. User sessions are managed with a local session store, which can be configured for persistence with the PostgreSQL database.

Mobile-First Features: The application is designed to be mobile-optimized, with a responsive UI and touch-friendly interactions. It integrates the browser's MediaDevices API for front-facing camera access and captures photos using a canvas.

Liveness Logic Implemented
The liveness check in this application is implemented on the client side, using custom logic rather than a third-party SDK. The core of this functionality relies on two main technologies:

MediaDevices API: This browser API is used to access the front camera stream, which is displayed on a hidden <canvas> element.

Canvas-based Algorithms: The application uses custom-developed algorithms that analyze the video stream on the canvas to detect signs of life. These algorithms check for motion, such as blinking or subtle head movements, to differentiate a live user from a static image or a video playback.

This approach ensures that the liveness check is performed in real-time, on-device, without making any backend calls for the detection process. Only after a successful liveness check is the selfie captured and uploaded to the server.
