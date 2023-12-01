# Stage 1: Compile and Build angular codebase
# Use official node image as the base image
FROM node:latest as build
# Set the working directory
WORKDIR /usr/local/app
# Add the source code to app
COPY ./ /usr/local/app/
# Install all the dependencies
RUN npm install
# Generate the build of the application
RUN npm run build

# Stage 2: Serve app with nginx server
# Use official nginx image as the base image
FROM nginx:latest
# Set the working directory
WORKDIR /usr/share/nginx/html
# Copy the build output
COPY --from=build /usr/local/app/dist/pointer /usr/share/nginx/html
# Remove the default Nginx configuration file
RUN rm /etc/nginx/conf.d/default.conf
# Copy a new configuration file
COPY /nginx.conf /etc/nginx/conf.d/
# Expose port 443 for HTTPS
EXPOSE 443
# Start Nginx when the container launches
CMD ["nginx", "-g", "daemon off;"]