# Bible Scroll

A Svelte application for horizontally scrolling through Bible verses with different zoom levels.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Docker Deployment

### Using Docker Compose (recommended)

```bash
# Build and start the container
docker-compose up -d

# Access the application at http://localhost:8080
```

### Using Docker directly

```bash
# Build the Docker image
docker build -t bible-scroll .

# Run the container
docker run -d -p 8080:80 --name bible-scroll-app bible-scroll

# Access the application at http://localhost:8080
```

### Stopping the container

```bash
# If using Docker Compose
docker-compose down

# If using Docker directly
docker stop bible-scroll-app
docker rm bible-scroll-app
```

## Environment Configuration

For different environments, you can:

1. Build with different environment variables
2. Create different Docker Compose files (e.g., `docker-compose.prod.yml`)

## Troubleshooting

If you encounter any issues:

1. Check if the container is running: `docker ps`
2. View container logs: `docker logs bible-scroll-app`
3. Ensure your `dist` folder contains the built application
