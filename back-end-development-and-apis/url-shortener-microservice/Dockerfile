FROM node
WORKDIR /app
COPY package.json .
COPY nodemon.json .

ARG NODE_ENV
RUN if [ "$NODE_ENV" = "production" ]; \
    then npm install --omit=dev; \
    else npm install; \
    fi

COPY . ./
CMD ["node", "index.js"]
