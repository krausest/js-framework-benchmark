
FROM ubuntu:22.04
COPY install_rust.sh /root/

# Set up NPM
RUN echo "unsafe-perm = true" > /root/.npmrc \
    && echo "NG_CLI_ANALYTICS=ci" >> /root/.npmrc

# Set up bower
RUN echo "{ \"allow_root\": true }" >  /root/.bowerrc

# replace shell with bash so we can source files
RUN rm /bin/sh && ln -s /bin/bash /bin/sh

# Set debconf to Noninteractive mode
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

# Install dependencies
RUN apt-get update
RUN apt-get install -y python3 m4 libtinfo5 libghc-zlib-dev rsync ghc haskell-stack g++ make git openjdk-8-jdk dos2unix wget curl

# Add Node.js version & NVM to PATH
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 16.15.1

RUN wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.3/install.sh | bash

# install node and npm
RUN source ${NVM_DIR}/nvm.sh \
    && nvm install ${NODE_VERSION}

# add node and npm to path so the commands are available
ENV NODE_PATH ${NVM_DIR}/v${NODE_VERSION}/lib/node_modules
ENV PATH ${NVM_DIR}/versions/node/v${NODE_VERSION}/bin:$PATH

# Create directories
RUN mkdir /server \
    && mkdir /build \
    && mkdir /src

# Volume before chown changes owwner
VOLUME /src
VOLUME /build
COPY package.json /build
WORKDIR /build

# Install rust
RUN dos2unix /root/install_rust.sh \
    && bash /root/install_rust.sh

# Create server
WORKDIR /server
COPY server /server

RUN npm install
# USER user
EXPOSE 8080
RUN mkdir /build/frameworks \
    && mkdir /build/frameworks/keyed \
    && mkdir /build/frameworks/non-keyed

CMD ["/server/runserver-docker.sh"]
#CMD ["node","index.js"]

