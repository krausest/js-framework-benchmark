R=reflex-platform
if [ ! -d "$R" ]; then
    git clone https://github.com/reflex-frp/reflex-platform.git
    cd $R
    git checkout 3e43d6ebf6129c9350ce2f8d30e1f951aa039989
fi
