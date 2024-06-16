# Taskoby

Taskoby is an innovative task management app designed to help parents organize tasks for their children and reward them for completed tasks. Using gamification strategies, Taskoby increases children's motivation to be responsible and disciplined.

## Table of Contents

- [Installation](#installation)
- [Features](#features)
- [User Guide](#user-guide)
- [Documentation](#documentation)
- [Contributions](#contributions)
- [License](#license)

## Test Taskoby app
1. **Test the app from the Expo URL:**
    - Install Expo Go on Google Play store/App store
    - Open this URL: [Expo Preview for Taskoby](https://expo.dev/preview/update?message=firebaseconfig&updateRuntimeVersion=1.0.0&createdAt=2024-06-11T14%3A23%3A49.724Z&slug=exp&projectId=7379c2e9-f891-4c84-8908-c093cd2f6d6a&group=a21d1b41-3b3a-4dbe-9228-0f0dc9054fb4)



## Installation

Follow the steps below to install and start the Taskoby app locally:

1. **Clone the repository:**
    ```sh
    git clone https://github.com/abdes96/Taskoby.git
    cd Taskoby
    ```

2. **Install the required packages:**
    ```sh
    npm install
    ```

3. **Create an `.env` file for Firebase credentials:**
    ```sh
    touch .env
    ```

    Add your Firebase credentials to the `.env` file. It should look  like this:
    ```
    EXPO_PUBLIC_API_KEY=your_api_key
    EXPO_PUBLIC_AUTH_DOMAIN=your_auth_domain
    EXPO_PUBLIC_PROJECT_ID=your_project_id
    EXPO_PUBLIC_STORAGE_BUCKET=your_storage_bucket
    EXPO_PUBLIC_MESSAGING_SENDER_ID=your_messaging_sender_id
    EXPO_PUBLIC_APP_ID=your_app_id
    EXPO_PUBLIC_MEASUREMENT_ID=your_measurement_id
    ```

4. **Start the Expo server:**
    ```sh
    npx expo start
    ```

5. **Open the app in a simulator or on a physical device:**
    - Scan the QR code that appears with the Expo Go app on your Android or iOS device.


## Features

- **Family Account:** All family members use the same account, providing a centralized task management system.
- **Assign Tasks:** Parents can assign tasks to specific children within the family.
- **Reward System:** A clear and attractive reward system where children can earn coins for completed tasks.
- **Photo Proof:** Children can upload photos of their completed tasks as proof of their effort.
- **Gamification Elements:** Built-in game elements to increase children's motivation.
- **Parent Control:** Parents approve completed tasks, and children receive their coins.

## User Guide

### Registration Process

1. **Register:** Create a new family by setting up a parent profile and child profiles.
2. **Create Profiles:** Choose avatars and fill in the required information for each family member.
3. **Select Profile:** After creating the profiles, select your own profile to get started.

### Using the App

1. **Assign Tasks:** Parents can assign specific tasks to children.
2. **Complete Tasks:** Children complete the assigned tasks and upload a photo as proof.
3. **Parent Approval:** Parents approve the completed tasks.
4. **Earn Coins:** Children receive coins for approved tasks.
5. **Leaderboard:** View the monthly leaderboard to see who has completed the most tasks.

## Documentation

### Technical Documentation

Taskoby is developed using the following technologies:

- **[React Native](https://reactnative.dev/docs/getting-started):** For developing the mobile app.
- **[Expo](https://docs.expo.dev/):** For easier setup and development of React Native apps.
- **[Firebase](https://firebase.google.com/docs?hl=fr):** Used for authentication and database storage.
- **[Ionicons](https://icons8.com/illustrations/style--bonbon):** Used for authentication and database storage.



### Push Notifications

Push notifications are managed via Expo. For more information on setting up push notifications, see the following resources:

- [Expo Push Notifications](https://docs.expo.dev/push-notifications/overview/)

## Contributions

We welcome contributions! Please fork the repository and create a pull request with your changes. Ensure your code follows our style guidelines and is well-documented.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
