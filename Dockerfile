# INSTALL CENTOS
FROM centos:centos6

COPY ./myapp /opt/myapp
RUN cd /opt/myapp
EXPOSE 8080
CMD [ "npm", "start" ]