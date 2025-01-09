FROM cypress/included:13.17.0

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package.json package-lock.json ./
RUN npm install

# Copy Cypress config and tests
COPY cypress.config.js .
COPY cypress ./cypress

# Copy Express server
COPY server.js .
EXPOSE 3000/tcp

ENTRYPOINT ["npx", "run", "server.js"]