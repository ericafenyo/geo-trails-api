FROM node:24-alpine

# Build image: docker build -t geo-trails-api .

# Set the working directory inside the container.
WORKDIR /usr/src/app

# Enable Corepack so pnpm is available without global install.
RUN corepack enable

# Copy dependency manifests first to maximize layer caching.
COPY package*.json pnpm-lock.yaml ./

# Install dependencies using the lockfile for reproducible builds.
RUN pnpm install --frozen-lockfile

# Copy the rest of the application source.
COPY . .

# Build the NestJS app into the dist directory.
RUN pnpm build

# Document the app port.
EXPOSE 3000

# Start the compiled application.
CMD ["node", "dist/src/main"]