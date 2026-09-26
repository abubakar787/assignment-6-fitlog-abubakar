 # FitLog — Workout Library

FitLog is a responsive workout library web application built with Next.js and Tailwind CSS. It helps users explore workouts, view exercise details, create a daily workout plan, save their favorite exercises, and track workout progress.

## Live Demo

* **Live Website:** Add your Vercel deployment URL here
* **GitHub Repository:** https://github.com/abubakar787/assignment-6-fitlog-abubakar

## Project Overview

FitLog provides a clean and interactive platform for users to browse exercises and organize their daily fitness routines. Users can explore workout information, add exercises to today's plan, save workouts for later, and mark completed exercises.

The application uses a workout API to retrieve exercise data and localStorage to preserve the user's plan and saved workouts.

## Technologies Used

* Next.js (App Router)
* React
* TypeScript
* Tailwind CSS
* Lucide React
* Browser localStorage
* REST API
* Git and GitHub
* Vercel

## Key Features

1. **Workout Library:** Fetch and display workout exercises from the provided API in a responsive card layout.
2. **Workout Details:** View exercise images, descriptions, muscle groups, equipment, difficulty, sets, reps, duration, calories, ratings, and instructions.
3. **Today's Workout Plan:** Add workouts to a daily plan with a maximum limit of five exercises.
4. **Saved Workouts:** Save exercises for later and manage the saved workout list.
5. **Workout Progress:** Mark exercises as completed or undo completion.
6. **Live Statistics:** Automatically calculate total exercises, estimated workout duration, and calories.
7. **Search and Sorting:** Search workouts and sort by duration, calories, or rating.
8. **Persistent Data:** Use localStorage to retain the workout plan and saved exercises across browser refreshes.
9. **Responsive Design:** Support desktop, tablet, and mobile screens.
10. **Interactive UI:** Include navigation, badges, loading states, notifications, and empty states.

## API Integration

FitLog uses the provided FitLog API to retrieve workout information.

**All Workouts:**

```text
https://api.abcz.workers.dev/api/fitlog
```

**Single Workout:**

```text
https://api.abcz.workers.dev/api/fitlog/:id
```

The API provides workout data used to populate the library and workout detail pages.

## Application Routes

| Route           | Description                     |
| --------------- | ------------------------------- |
| `/`             | Home page and workout library   |
| `/workout/[id]` | Dynamic workout details page    |
| `/my-plan`      | Today's plan and saved workouts |
| Not Found       | Custom 404 page                 |

## Getting Started

### Prerequisites

* Node.js installed
* npm installed
* Git installed

### Installation

1. Clone the repository:

```bash
git clone https://github.com/abubakar787/assignment-6-fitlog-abubakar.git
```

2. Navigate to the project folder:

```bash
cd assignment-6-fitlog-abubakar
```

3. Install dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open the application in your browser:

```text
http://localhost:3000
```

## Build for Production

Run the following command to create a production build:

```bash
npm run build
```

To start the production server:

```bash
npm start
```

## Deployment

The application can be deployed on Vercel.

1. Push the project to GitHub.
2. Import the GitHub repository into Vercel.
3. Configure the project using the Next.js framework preset.
4. Deploy the application.
5. Test the live website, including the home page, workout details, and My Plan routes.

## Author

**Abu Bakar**

GitHub: [abubakar787](https://github.com/abubakar787)

Project: FitLog — Workout Library

---

© 2026 FitLog — Workout Library. Train hard, log honest.
