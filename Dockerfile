# INSTALL CENTOS
FROM centos:centos6

ADD . /tmp/

RUN yum install -y libaio.x86_64 glibc.x86_64
RUN yum -y localinstall /tmp/oracle* --nogpgcheck
RUN mkdir /usr/lib/oracle/12.2/client/network/admin -p

ENV ORACLE_HOME=/usr/lib/oracle/12.2/client64
ENV PATH=$PATH:$ORACLE_HOME/bin
ENV LD_LIBRARY_PATH=$ORACLE_HOME/lib
ENV TNS_ADMIN=$ORACLE_HOME/network/admin
