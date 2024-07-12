# Use the official Apache HTTP Server image
FROM httpd:2.4

# Copy the dist folder to the htdocs directory of Apache
COPY ./dist/ /usr/local/apache2/htdocs/

# Expose port 80
EXPOSE 80

# Command
# docker build -t my-apache-app .
# docker run -dit --name my-running-app -p 8888:80 my-apache-app