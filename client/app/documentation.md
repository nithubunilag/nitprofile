## Dashboard Folder Documentation

The Dashboard folder serves as a pivotal component within the codebase, orchestrating the presentation and functionality of user interfaces for both admins and students. It encompasses a structured hierarchy consisting of two essential folders and two files, each playing a distinct role in the operation of the dashboard system.

### Folder Structure

- **Admin:** This directory encapsulates the administrative dashboard functionalities, catering to the needs of both admin and super admin roles. There lies a comprehensive array of routes designed to facilitate administrative tasks and superuser privileges.

- **Student:** The Student folder embodies the dashboard tailored explicitly for student users. It provides an interface optimized for student-centric activities and functionalities.

### Key Files

- **layout.tsx:** This file dictates the overarching layout utilized across both the admin and student dashboards. Noteworthy is its utilization of a role-based access mechanism. By dynamically assessing user roles, it renders content tailored to the specific privileges associated with each role, thereby ensuring a personalized and secure user experience.

- **page.tsx:** Serving as the gateway to the dashboard, this file handles the initial landing page functionality. Upon accessing this page, users are redirected to their respective dashboards, based upon their designated roles within the system. This redirection mechanism ensures a streamlined user journey, optimizing accessibility and efficiency.

## Auth Folder Documentation

The Auth folder serves as a component within the codebase, facilitating user authentication processes. It contains a structured hierarchy consisting of five folders and two files, each contributing to the seamless management of user access and authentication flows.

### Folder Structure

- **Forgot Password:** This directory contains functionalities dedicated to handling the password recovery process for users who have forgotten their passwords. It orchestrates the necessary steps for users to regain access to their accounts securely.

- **Login:** The Login folder encapsulates the login authentication mechanisms, providing users with a streamlined interface to securely authenticate their identities and access their accounts.

- **Reset Password:** Herein lies the logic and functionalities pertaining to resetting user passwords. This directory ensures a robust and secure process for users to reset their passwords in the event of a security breach or forgotten credentials.

- **Signup:** The Signup directory houses the functionalities necessary for user registration and account creation. It offers a seamless onboarding experience for new users, facilitating the creation of accounts within the system.

- **Verify Account:** This directory encompasses the functionalities required for verifying user accounts. It manages the verification process, ensuring the legitimacy of user identities and enhancing account security.

### Key Files

- **layout.tsx:** This essential file defines the layout utilized across the various authentication processes within the Auth folder. It ensures consistency in design and user experience throughout the authentication journey, enhancing usability and brand identity.

- **page.tsx:** Serving as the orchestrator of the authentication process, this file governs the initial landing page functionality for users interacting with authentication flows. It directs users to the appropriate authentication process based on their intent, ensuring a seamless and intuitive user experience.
