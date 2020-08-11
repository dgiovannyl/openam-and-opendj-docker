from openidentityplatform/opendj

ADD run /var/tmp/
RUN ls -la /var/tmp/

ADD opendj.ldif /tmp/
RUN ls -la /tmp/

USER root

CMD ["/var/tmp/run"]
