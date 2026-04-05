# 🎨 UI/UX Enhancement of Workshop Booking Platform

## Overview

This project focuses on redesigning and enhancing the user interface and experience of the existing Workshop Booking platform developed under FOSSEE. The primary objective was to improve usability, responsiveness, and visual appeal while preserving the original backend logic.

The updated interface emphasizes clarity, accessibility, and a smooth user journey across devices, with special attention to mobile users.

---

## Technical Reasoning & Implementation Details

### What design principles influenced your approach?

The redesign was primarily driven by the concept of **Decoupled Architecture**, where the Django backend operates independently from the React frontend. This separation improves scalability and maintainability.

From a UI perspective, the focus was on **Simplicity and Consistency**. A structured design system was implemented using reusable components and standardized styling practices, ensuring uniformity across all pages and making future updates easier.

---

### How did you achieve responsiveness across devices?

A **Mobile-First Design Strategy** was followed. Layouts were initially designed for smaller screens and progressively enhanced for larger devices.

Using **CSS Flexbox and Grid**, components adapt fluidly across different screen sizes. Breakpoints were applied to restructure layouts into multi-column formats for tablets and desktops, ensuring a seamless experience on all devices.

---

### What trade-offs were considered between design and performance?

The application uses **Client-Side Rendering (CSR)** with React and Vite. While this increases the initial load time due to JavaScript bundle size, it significantly improves responsiveness after the first load.

This approach allows faster navigation, smoother interactions, and a more dynamic interface, which enhances overall user experience despite the slight initial delay.

---

### What challenges did you face and how did you solve them?

One of the major challenges was transforming the tightly integrated Django views into independent API endpoints.

To solve this:
- Django Rest Framework (DRF) was introduced  
- APIs were carefully structured and tested using serializers  
- Authentication and session handling were adapted for API-based communication  
- CORS issues were resolved to enable smooth frontend-backend interaction  

This step-by-step backend restructuring made integration with React efficient and secure.

---

## 🛠 Core Features

### Statistics

#### Instructors Only
- Monthly Workshop Count  
- Instructor/Coordinator Profile Stats  
- Upcoming Workshops  
- View/Post Comments on Coordinator Profiles  

#### Open to All
- Workshops visualized across the map of India  
- Pie chart representing workshop distribution by type  

---

### Workshop Management Features

- Instructors can **Accept, Reject, or Delete** workshop requests  
- Ability to **Postpone workshops** based on coordinator requests  
- Coordinators can propose workshop dates based on availability  

---

## 📸 Before and After Screenshots

**Home Before:**  
![Home Before](./screenshots/before1.png)

**Home After:**  
![Home After](./screenshots/after1.png)

**Workshop Statistics Before:**  
![Stats Before](./screenshots/before2.png)

**Workshop Statistics After:**  
![Stats After](./screenshots/after2.png)

---

## 🚀 Setup Instructions

This project is divided into two parts:
- Django Backend (API)
- React Frontend

Both must run simultaneously.

---

### 1. Backend Setup (Django)

```bash
# Create virtual environment
python -m venv venv

# Activate environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Run development server
python manage.py runserver

# Move to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev


##Running URLs
Frontend: http://localhost:5173
Backend: http://localhost:8000

##Student Details
Name: Aditya Pandey
Institution: VIT Bhopal
Email: pandeyap2605@gmail.com
College Email: aditya.23bce10203@vitbhopal.ac.in