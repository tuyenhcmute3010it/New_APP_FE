# News App Frontend (Mobile)

A React Native mobile app built with Expo for end-users to consume news content in the News Application.


## Prerequisites

- **Node.js**: Version 16.20.0 (use `nvm` to manage versions: `nvm install 16.20.0`)
- **npm**: Included with Node.js
- **Git**: For cloning the repository ([git-scm.com](https://git-scm.com))
- **Vercel CLI**: For deployment (`npm install -g vercel`)

## Setup

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/tuyenhcmute3010it/New_APP_FE
   cd New_APP_FE
   ```

2. Switch to Node.js Version 16.20.0:

   ```bash
   nvm use 16.20.0
   ```

3. Install Dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
4. Configure Environment Variables:

- Create a .env.local file in the project root.
  Add the backend API URL (update to the deployed NestJS backend URL after deployment):
- env
  ```bash
    EXPO_PUBLIC_API_URL=http://10.0.2.2:8000
    EXPO_PUBLIC_ANDROID_API_URL=http://10.0.2.2:8000
    EXPO_PUBLIC_IOS_API_URL=http://localhost:8000
  ```
5. Running Locally

- Start the development server:

   ```bash
   npm run dev
- click a to open app with android
