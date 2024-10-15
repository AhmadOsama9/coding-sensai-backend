# Use the official Node.js image as the base image
FROM node:21

# Set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install 

# Copy the rest of the application code
COPY . .

# Set environment variables directly in the Dockerfile
# Of course there's a better practice for that but my point now is to make it work
ENV DB_HOST="localhost" \
    DB_PORT="5432" \
    DB_USER="user123" \
    DB_PASSWORD="pass123" \
    DB_NAME="db123" \
    PORT="4000" \
    GOOGLE_CLIENT_ID="792882788323-06u4lomb195kchrpg9ajj26takqqvv7i.apps.googleusercontent.com" \
    GOOGLE_CLIENT_SECRET="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" \
    GOOGLE_REDIRECT_URI="http://localhost:4000/api/user/auth/google/callback" \
    JWT_SECRET="rQk%*fV%zW+3#Ds49hV%gy4qYsfG+jc7Ls(stSTz&*2h4MMgyJ7(tjE7fSys&" \
    GITHUB_CLIENT_ID="Ov23li6rsluoV59EqIE5" \
    GITHUB_CLIENT_SECRET="472932079bfb14a1c0230ecd32467d84f51684fb" \
    GITHUB_REDIRECT_URL="http://localhost:4000/api/user/auth/github/callback" \
    FRONTEND_REDIRECT_URL="http://localhost:5173/auth/callback" \
    API_USERNAME="your_api_username" \
    API_TOKEN="your_api_token" \
    STORE_CODE="your_store_code" \
    RETURN_URL="https://yourdomain.com/payment-success" \
    CANCEL_URL="https://yourdomain.com/payment-cancel" \
    NOTIFICATION_URL="https://yourdomain.com/api/payment-notification" \
    CRYPTOMUS_MARCHANT_ID="" \
    CRYPTOMUS_API_KEY="" \
    CRYPTOMUS_CALLBACK_URL="http://localhost:4000/api/payment/webhook" \
    CRYPTOMUS_REDIRECT_URL="http://localhost:5173/payment/redirection" \
    DAILY_LOGIN_POINTS=10


# Expose the port that your app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 
