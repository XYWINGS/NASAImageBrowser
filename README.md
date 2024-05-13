
NASA Image Explorer # React + Vite
NETLIFY DEPLOYED URL 
https://nasaimagebrowser.netlify.app

This React application allows you to explore images from NASA's public APIs, showcasing Mars rover photos, EPIC imagery, and Astronomy Picture of the Day (APOD).

Project Setup

Prerequisites:
Node.js and npm  installed on your system.

Installation:
Clone this repository:

Bash
https://github.com/sliitcsse/se3040-assignment02-IT21209352
https://github.com/sliitcsse/se3040-assignment02-IT21209352?tab=readme-ov-file
https://github.com/sliitcsse/se3040-assignment02-IT21209352/tree/main/af2-app
git clone https://github.com/IT21209352/nasa-image-explorer.git


Navigate to the project directory:

Install dependencies:
Bash
npm install



Usage
Start the development server:

Bash
npm start

This will start a local development server at http://localhost:3000/. The application will automatically reload in the browser when you make changes to the code.

Explore the application:

Use the navigation bar or buttons to switch between Mars Rovers, EPIC, and APOD sections.
In the Mars Rovers section, select a rover from the dropdown to view its images.
The EPIC section displays a live feed of Earth captured by the DSCOVR satellite.
The APOD section showcases a new astronomy image and explanation every day.
Build for Deployment
To create an optimized production build of the application, run:

Bash
npm run build
This will create a build folder containing the production-ready application files.


APIs Used:
Mars Rover Photos API 2024-02-19 CURIOSITY
EPIC API  2024-03-26
APOD API ANY

Challenges Faced:

Handling API Rate Limits: Both EPIC and APOD APIs have rate limits. The application could potentially exceed these limits if used excessively.
Error Handling: Implementing robust error handling for potential API failures or network issues to ensure a smooth user experience.
Data Caching: Caching frequently accessed data can improve performance by reducing the number of API requests.
Solutions:

API Rate Limit Awareness: The application can implement logic to respect API rate limits and display appropriate messages if limits are exceeded.
Error Handling: Implement error boundaries and informative messages to handle API failures or network issues gracefully.
Data Caching: Consider implementing a caching mechanism for frequently accessed data like APOD images, reducing unnecessary API calls.

to run test cases
npx jest src/HomePage.test.js
npx jest src/MarsImages.test.js
npx jest src/PictureoftheDay.test.js

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh


[![Review Assignment Due Date](https://classroom.github.com/assets/deadline-readme-button-24ddc0f5d75046c5622901739e7c5dd533143b0c8e959d652212380cedb1ea36.svg)](https://classroom.github.com/a/V1F4A3D5)
