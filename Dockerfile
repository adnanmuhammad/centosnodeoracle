# INSTALL CENTOS
FROM centos:centos6

#INSTALL LIBAIO1 & UNZIP (NEEDED FOR STRONG-ORACLE)
RUN yum -y update \
  && yum install -y curl \
  && yum install -y libaio \
  && yum install -y unzip \
  && yum install -y gcc-c++ make \
  && curl --silent --location https://rpm.nodesource.com/setup_6.x | bash - \
  && yum -y install nodejs \
  && yum install -y npm git \
  && npm install -g strongloop

#ADD ORACLE INSTANT CLIENT
RUN mkdir -p opt/oracle
ADD ./oracle/linux/ .

RUN unzip instantclient-basic-linux.x64-12.1.0.2.0.zip -d /opt/oracle \
  && unzip instantclient-sdk-linux.x64-12.1.0.2.0.zip -d /opt/oracle  \
  && mv /opt/oracle/instantclient_12_1 /opt/oracle/instantclient \
  && ln -s /opt/oracle/instantclient/libclntsh.so.12.1 /opt/oracle/instantclient/libclntsh.so \
  && ln -s /opt/oracle/instantclient/libocci.so.12.1 /opt/oracle/instantclient/libocci.so

ENV LD_LIBRARY_PATH="/opt/oracle/instantclient"
ENV OCI_HOME="/opt/oracle/instantclient"
ENV OCI_LIB_DIR="/opt/oracle/instantclient"
ENV OCI_INCLUDE_DIR="/opt/oracle/instantclient/sdk/include"

RUN echo '/opt/oracle/instantclient/' | tee -a /etc/ld.so.conf.d/oracle_instant_client.conf && ldconfig

COPY ./myapp /opt/myapp
RUN cd /opt/myapp

RUN npm install loopback-connector-oracle --save \
  && npm install oracledb

EXPOSE 8080
CMD [ "node", "/opt/myapp/." ]