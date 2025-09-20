# AyurBalance - Ayurvedic Diet Management

Welcome to AyurBalance, a modern web application designed to help dietitians and Ayurvedic practitioners create and manage personalized diet plans based on Ayurvedic principles. The application features a clean, calming, and intuitive UI/UX inspired by Ayurvedic aesthetics.

## ✨ Core Features

- **Firebase Authentication**: Secure user registration and login functionality.
- **Patient Profile Management**: Create and manage detailed profiles for patients, including their name, age, gender, dosha type, and initial health notes.
- **AI-Powered Diet Plan Generation**: An intelligent tool that takes patient data (dosha, imbalances, preferences) and generates a comprehensive, personalized Ayurvedic diet plan. The output is structured with clear headings and bullet points for readability.
- **AI Recipe Analysis**: Analyze any recipe's ingredients and instructions to receive a detailed breakdown of its nutritional and Ayurvedic properties, including its effect on different doshas.
- **Natural Language Q&A**: A conversational AI assistant that can answer questions related to diet, wellness, and Ayurvedic principles.
- **Food Database**: A searchable database of common food items, complete with their category, approximate calories, and Ayurvedic properties (e.g., V-P-K-).
- **User Profile Customization**: Users can personalize their profile by changing their display name, title, and profile picture. Profile pictures can be uploaded from a file or captured directly using a webcam.
- **Wellness Journey Visualization**: A dashboard chart that visualizes a user's wellness score and dosha balance over time.
- **Theme and Notification Settings**: A dedicated settings page to toggle between light and dark modes and manage notification preferences.

## 🛠️ Technology Stack

- **Framework**: Next.js (with App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS with ShadCN UI components
- **Authentication & Database**: Firebase (Authentication, Firestore, Storage)
- **Generative AI**: Google's Genkit
- **Fonts**: Roboto for headlines and Literata for body text to create an elegant, readable interface.

## 🚀 Getting Started

1.  **Install Dependencies**:
    ```bash
    npm install
    ```

2.  **Set up Firebase**:
    - Create a new project in the [Firebase Console](https://console.firebase.google.com/).
    - Add a new Web App to your project.
    - Copy the Firebase configuration object.
    - Create a `.env.local` file in the root of the project and add your Firebase credentials with the `NEXT_PUBLIC_` prefix:
      ```
      NEXT_PUBLIC_FIREBASE_API_KEY="your-api-key"
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-auth-domain"
      NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-project-id"
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET="your-storage-bucket"
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID="your-messaging-sender-id"
      NEXT_PUBLIC_FIREBASE_APP_ID="your-app-id"
      ```

3.  **Run the Development Server**:
    ```bash
    npm run dev
    ```

    Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.

## 📄 Page Overview

- **/login**: Signup and Login page.
- **/dashboard**: The main dashboard with links to all features.
- **/patients**: Manage patient profiles.
- **/food-database**: Browse foods and their properties.
- **/diet-plan-tool**: Generate AI-based diet plans.
- **/recipe-analysis**: Analyze recipes with AI.
- **/q-and-a**: Chat with the Ayurvedic AI assistant.
- **/profile**: View and edit your user profile.
- **/settings**: Manage application theme and notifications.
