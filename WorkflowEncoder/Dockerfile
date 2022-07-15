FROM alfg/bento4:latest

FROM node:12-alpine 

EXPOSE 8182

RUN apk add --no-cache ffmpeg

# Create the work dir and set permissions as WORKDIR set the permissions as root
RUN mkdir /home/node/app/ && chown -R node:node /home/node/app

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

# set the context from now on to use the node user, which is created in the base image
USER node

RUN npm install --only=prod && npm cache clean --force --loglevel=error

# Copy app source
COPY --chown=node:node index.js .
COPY --chown=node:node lib ./lib/

COPY --from=0 /opt/bento4/bin ./bento4-bin/

ENV PATH="/home/node/app/bento4-bin:${PATH}"

CMD [ "node", "index.js"]
