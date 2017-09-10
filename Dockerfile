# INSTALL CENTOS
FROM centos:centos6

#INSTALL LIBAIO1 & UNZIP (NEEDED FOR STRONG-ORACLE)
RUN yum -y update \
  && yum install -y curl \
  && curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - \
  && yum -y install nodejs npm

COPY ./myapp /opt/myapp
RUN cd /opt/myapp
RUN node app