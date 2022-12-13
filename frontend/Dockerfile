#FROM node:18 as build
#WORKDIR /frontend
#
#COPY package.json /frontend/package.json
#COPY yarn.lock /frontend/yarn.lock
#COPY tsconfig.json /frontend/tsconfig.json
#COPY .eslintrc.js /frontend/.eslintrc.js
#COPY .prettierrc /frontend/.prettierrc
#RUN yarn install
#COPY src /frontend/src
#COPY public /frontend/public
#RUN sed 's/http:\/\/localhost:8000//' src/**/*.tsx -i
#RUN sed 's/http:\/\/localhost:8000//' src/**/*.ts -i
#RUN npm run build --prod --silent


# too slow, use local build
FROM nginx:latest
RUN mkdir -p /usr/share/nginx/html
#COPY --from=build /frontend/build /usr/share/nginx/html
COPY build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/sites-available/nginx.conf
RUN rm -f /etc/nginx/sites-available/default
RUN rm -f /etc/nginx/conf.d/default
RUN mkdir -p /etc/nginx/sites-enabled
RUN ln -s -f /etc/nginx/sites-available/nginx.conf /etc/nginx/sites-enabled/nginx.conf
RUN ln -s -f /etc/nginx/sites-available/nginx.conf /etc/nginx/conf.d/nginx.conf

CMD nginx -g 'daemon off;'
