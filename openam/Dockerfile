from openidentityplatform/openam

USER root

ADD config.properties /usr/openam/ssoconfiguratortools/config.properties

ADD /openig/jetty-distribution-8.1.21.v20160908 /jetty/
ADD /openig/OpenIG-3.1.0.war /jetty/OpenIG-3.1.0.war

ADD run /var/tmp/
RUN chmod +x /var/tmp/run

ADD wait-for.sh /tmp/
RUN chmod 755 /tmp/wait-for.sh 

CMD ["/bin/bash", "-c", "bash /tmp/wait-for.sh opendj:1389 -t 60 -s -- /var/tmp/run" ]