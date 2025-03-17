FROM node:18-slim

WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install

# Copy project files
COPY . .

# Run the setup-env script to propagate environment variables
RUN node scripts/setup-env.js

# Expose the port
EXPOSE ${PORT:-3000}

# Start the application
CMD ["node", "index.js"] 