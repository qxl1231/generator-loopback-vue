FROM ubuntu
MAINTAINER longshao


RUN apt-get update
RUN apt-get install -y nodejs
#RUN apt-get install -y nodejs=0.6.12~dfsg1-1ubuntu1


# Run app using node
CMD apt-get update; apt-get install -y nodejs; npm install; node /server/server.js
# CMD ["/usr/bin/node", "/server/server.js"] 
