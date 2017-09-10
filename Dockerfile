# INSTALL CENTOS
FROM centos:centos6

#INSTALL LIBAIO1 & UNZIP (NEEDED FOR STRONG-ORACLE)
RUN yum -y update \
  && yum install -y curl \
  && yum install -y unzip \
  && yum install -y gcc-c++ make \
  && curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - \
  && yum -y install nodejs

COPY ./myapp /opt/myapp
RUN cd /opt/myapp
EXPOSE 8080
CMD [ "npm", "start" ]