FROM node:erbium

# Create and set the working directory
RUN mkdir /frontend
WORKDIR /frontend

# Only copy package.json. All other files wil be shared with the host through a volume.
# NOTE: For a production image, we should COPY all files so that the image is self-sufficient (and only use volumes
#   for data storage/persistent data).
COPY ./package.json /frontend
# Install node dependencies
RUN npm install

# Make port 3001 available to the world outside this container
EXPOSE 3001

# Run the start script when the container launches
CMD ["npm", "run", "start"]
