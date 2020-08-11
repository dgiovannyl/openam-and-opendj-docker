from openidentityplatform/openam

USER root

ADD run /var/tmp/
RUN ls -la /var/tmp/

ADD configurator-tool /tmp/configurator-tool/
RUN ls -la /tmp/configurator-tool/

RUN chmod +x /var/tmp/run

RUN cat /etc/hosts

ADD wait-for.sh /tmp/

RUN chmod 755 /tmp/wait-for.sh 

CMD ["/bin/bash", "-c", "bash /tmp/wait-for.sh opendj:1389 -t 60 -s -- /var/tmp/run" ]