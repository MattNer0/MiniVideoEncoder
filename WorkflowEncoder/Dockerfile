FROM alfg/bento4:latest

FROM node:12-alpine 

ARG USER_ID=997
ARG GROUP_ID=997

EXPOSE 8182

RUN apk add --no-cache ffmpeg

RUN addgroup --gid $GROUP_ID user
#RUN useradd -m -d /home/user --disabled-password --gecos '' --uid $USER_ID --gid $GROUP_ID -G node user
RUN adduser --disabled-password --gecos "" --home "/home/user" --uid $USER_ID --ingroup user user

# Create the work dir and set permissions as WORKDIR set the permissions as root
RUN mkdir /home/user/app/ && chown -R user:user /home/user/app

WORKDIR /home/user/app

COPY --chown=user:user package*.json ./

# set the context from now on to use the node user, which is created in the base image
USER user

RUN npm install --only=prod && npm cache clean --force --loglevel=error

# Copy app source
COPY --chown=user:user index.js .
COPY --chown=user:user lib ./lib/

COPY --from=0 /opt/bento4/bin ./bento4-bin/

ENV PATH="/home/user/app/bento4-bin:${PATH}"

CMD [ "node", "index.js"]
