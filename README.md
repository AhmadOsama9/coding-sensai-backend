# Education Platform - Backend

**Aug 2024 - Oct 2024**

## Description:

Developed the **backend** for the education platform using **Node.js** and **Express.js**, with a **PostgreSQL** database to handle data storage for users, courses, progress tracking, and more. Integrated **GitHub OAuth** for user authentication and implemented scalable, serverless architecture with **AWS Lambda** and **Amazon RDS** for the PostgreSQL database.

---

## Key Features:
- **API Routes**: RESTful API routes to manage user authentication, course progress, milestones, quizzes, assignments, and final projects.
- **Authentication**: **OAuth (GitHub)** integration for seamless login.
- **Database Management**: Using **PostgreSQL** for relational data storage, including user data and course-related information.
- **Gamification**: Support for badges, progress tracking, and achievements based on user performance in courses and milestones.
- **Serverless Architecture**: Deployed the backend on **AWS Lambda** for scalable, cost-effective serverless computing.

---

## Technologies Used:

- **Backend**: 
  - **Node.js**: Backend server and logic to handle requests, data processing, and API routing.
  - **Express.js**: Framework used to create RESTful APIs and manage routing.
  - **PostgreSQL**: Relational database used to store user data, courses, milestones, and progress.

- **Authentication**:
  - **OAuth**: Authentication through **GitHub OAuth** for users to log in securely.

- **Cloud Services**:
  - **AWS Lambda**: Serverless compute service used for running backend functions.
  - **Amazon RDS (PostgreSQL)**: Managed PostgreSQL database to store and query relational data.
  - **Amazon S3**: For storing static assets and course materials.

- **Real-time Communication**:
  - Optionally, use of **WebSockets** or **Firebase** to handle real-time features such as messaging, notifications, and updates (if required).

---

## Structure:

- `src/controllers/`: Controllers to handle API logic (e.g., user authentication, course management).
- `src/models/`: Database models for user, courses, milestones, and progress.
- `src/routes/`: API routes for handling user actions and CRUD operations.
- `src/utils/`: Utility functions (e.g., file uploads, JWT tokens).

---

## Skills:

- **Backend**: Node.js, Express.js, PostgreSQL
- **Authentication**: OAuth (GitHub)
- **Cloud**: AWS Lambda, Amazon RDS (PostgreSQL), Amazon S3
- **Real-time Communication**: WebSockets, Firebase (if applicable)
