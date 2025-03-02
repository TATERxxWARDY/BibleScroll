FROM nginx:alpine

# Copy the built static files to Nginx's serve directory
COPY dist /usr/share/nginx/html

# Copy custom Nginx config if needed
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start Nginx server
CMD ["nginx", "-g", "daemon off;"] 