
FROM ubuntu:21.10
COPY install_rust.sh /root/
RUN echo "unsafe-perm = true" > /root/.npmrc
RUN echo "NG_CLI_ANALYTICS=ci" >> /root/.npmrc
RUN echo "{ \"allow_root\": true }" >  /root/.bowerrc

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get update
RUN apt-get install -y python3 m4 libtinfo5 libghc-zlib-dev rsync ghc haskell-stack curl g++ make git openjdk-8-jdk dos2unix python

ENV NVM_DIR /usr/local/nvm
RUN mkdir -p $NVM_DIR
ENV NODE_VERSION 16.15.1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.35.0/install.sh | bash

# install node and npm
RUN source $NVM_DIR/nvm.sh \
    && nvm install $NODE_VERSION \
    && nvm alias default $NODE_VERSION \
    && nvm use default

# add node and npm to path so the commands are available
ENV NODE_PATH $NVM_DIR/v$NODE_VERSION/lib/node_modules
ENV PATH $NVM_DIR/versions/node/v$NODE_VERSION/bin:$PATH

RUN mkdir /server
RUN mkdir /build
RUN mkdir /src

# Volume before chown changes owwner
VOLUME /src
VOLUME /build
COPY package.json /build
WORKDIR /build

# Install rust
RUN dos2unix /root/install_rust.sh
RUN bash /root/install_rust.sh

# Create server

COPY server /server
WORKDIR /server
RUN npm install

# USER user

RUN npm install
EXPOSE 8080
WORKDIR /build
CMD ["mkdir", "/build/frameworks"]
CMD ["mkdir", "/build/frameworks/keyed"]
CMD ["mkdir", "/build/frameworks/non-keyed"]
CMD ["/server/runserver-docker.sh"]
#CMD ["node","index.js"]

