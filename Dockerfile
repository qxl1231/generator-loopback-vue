FROM ubuntu
MAINTAINER longshao


RUN apt-get update
RUN apt-get install -y nodejs
#RUN apt-get install -y nodejs=0.6.12~dfsg1-1ubuntu1


# Run app using nodemon
CMD npm install; nodemon /server/server.js
# CMD ["/usr/bin/node", "/server/server.js"] 
