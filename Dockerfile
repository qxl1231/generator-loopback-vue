# FROM ubuntu
# MAINTAINER longshao


# RUN apt-get update
# RUN apt-get install -y nodejs
# #RUN apt-get install -y nodejs=0.6.12~dfsg1-1ubuntu1


# # Run app using node
# CMD apt-get update; apt-get install -y nodejs; npm install; node /server/server.js
# # CMD ["/usr/bin/node", "/server/server.js"] 

FROM node:argon

# Create app directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json /usr/src/app/
RUN npm install

# Bundle app source
COPY . /usr/src/app

EXPOSE 4000

# CMD [ "npm", "run build:js" ]
#CMD [ "node", "." ]
CMD npm run build:js && node .
