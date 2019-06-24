FROM centos:latest
COPY install_rust.sh /root/
RUN echo "unsafe-perm = true" > /root/.npmrc
RUN echo "{ \"allow_root\": true }" >  /root/.bowerrc
RUN curl -sL https://rpm.nodesource.com/setup_10.x | bash -
RUN yum install -y nodejs gcc-c++ make git java
RUN mkdir /server
RUN mkdir /build
RUN mkdir /src

COPY package.json /server
WORKDIR /server
RUN npm install 

# Volume before chown changes owwner
VOLUME /src
VOLUME /build
WORKDIR /build

# Install chrome
RUN curl -sL https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm > /root/chrome.rpm
RUN yum localinstall -y /root/chrome.rpm

# Install rust
RUN bash /root/install_rust.sh

# USER user

# RUN npm install
EXPOSE 8080
CMD ["/server/node_modules/.bin/http-server","-c-1","/build"]
