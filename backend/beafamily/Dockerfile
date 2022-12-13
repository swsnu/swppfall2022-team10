# Dockefile for deploy

FROM python:3.9

WORKDIR /backend
RUN pip install uwsgi
COPY uwsgi /backend/uwsgi

COPY requirements.txt /backend/requirements.txt
RUN pip install -r requirements.txt

COPY config /backend/config
COPY api /backend/api
COPY beafamily /backend/beafamily
COPY manage.py /backend/manage.py

ENV DJANGO_SETTINGS_MODULE="config.deploy"

RUN mkdir -p logs
RUN mkdir -p data
RUN mkdir -p /log
RUN touch /log/uwsgi.log
#RUN python manage.py makemigrations
#RUN python manage.py migrate

#ENTRYPOINT uwsgi --ini uwsgi/uwsgi.ini
CMD uwsgi --ini uwsgi/uwsgi.ini --http=:$PORT










