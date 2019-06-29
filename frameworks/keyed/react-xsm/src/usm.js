let _data = {};
let config = {};
let sharedState = {};
let sublist = new Map();
let rmsublist = new Map();
let debug=false;
let trace=false;
let keysep='.';
let fwsetstate, fwinitstate, fwumount, fwcname;

const frameworkcfg = {
    React: {
        umount: 'componentWillUnmount',
        setstate: self => (key, val) => {
            self[key] = val;
            self.forceUpdate();
        },
        initstate: (self, key, val) => {
                let v = get(key);
                if( v === undefined ) {
                    self[key] = val;
                    setflat(key, val);
                } else {
                    self[key] = v;
                }
        },
        cname: self => self.constructor.name,
    },
    Vue: {
        umount: 'destroyed',
        setstate: self => (key, val) => self[key] = val,
        initstate: (self, key, val) => self[key] = val,
        cname: self => self.$options._componentTag
    },
    Angular: {
        umount: 'ngOnDestroy',
        setstate: self => (key, val) => self[key] = val,
        initstate: (self, key, val) => self[key] = val,
        cname: self => self.constructor.name,
    },
};

function rmkey(key) {
    let start, sep;
    if( config.sep )
        sep = config.sep;
    else
        sep = keysep;
    start = _data;
    const keystr = key + '';
    let keychain = keystr.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = start;
    let keyitem;
    for(let i=0; i<len; i++) {
        keyitem = keychain[i];
        if( i === breaklen ) {
            ref[keyitem] = undefined;
            return;
        }
        if( !ref[keyitem] ) {
            ref[keyitem] = {};
        } 
        ref = ref[keyitem];
    }
    if( debug ) {
        if( trace )
            console.trace('trace for removing key=', key);
        console.log('key=', key, 'store', {..._data});
    }
}

function rmsub(key, id) {
      if( (id||id===0) && sublist.has(key) && (sublist.get(key).length) > id ) {
          sublist.get(key).splice(id, 1)
          if( sublist.get(key).length === 0 ) {
              sublist.delete(key)
              rmkey(key);
          }
      }
}

function addsub(key, cb) {
      if( !sublist.has(key) ) sublist.set(key, []);
      let subitem = sublist.get(key);
      subitem.push((key,val)=>cb(key,val))
      return subitem.length-1;
}

export function setflat(key, val) {
    let cblst = sublist.get(key);
    if(  cblst ) {
        if( cblst.length == 1 ) {
            cblst[0](key, val);
        } else {
            for(let i=0; i<cblst.length; i++) {
                cblst[i](key, val);
            }
        }
    }
    _data[key] = val;
}
export function set(key, val, opt) {
    let start, sep;
    if( opt && opt.sep )
        sep = opt.sep;
    else
        sep = keysep;
    if( opt && opt.pathref instanceof Object ) {
        start = opt.pathref;
    } else {
        start = _data;
    }
    const keystr = key + '';
    let keychain = keystr.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = start;
    let keyitem;
    for(let i=0; i<len; i++) {
        keyitem = keychain[i];
        if( i === breaklen ) {
            ref[keyitem] = val;
            if(  sublist.has(key) ) {
                let cblst = sublist.get(key);
                for(let i=0; i<cblst.length; i++) {
                    cblst[i](key, val);
                }
            }
            if( debug ) {
                if( trace )
                    console.trace('trace for key=', key, 'val=', val);
                console.log('key=', key, 'store', {..._data});
            }
            return;
        }
        if( !ref[keyitem] ) {
            ref[keyitem] = {};
        } 
        ref = ref[keyitem];
    }
}

export function getflat(key) {
    return _data[key];
}

export function get(key, sep) {
    sep = sep || keysep;
    key = key + '';
    let keychain = key.split(sep);
    let len = keychain.length;
    let breaklen = len-1;
    let ref = _data;
    let keyval;
    for(let i=0; i<len; i++) {
        keyval = keychain[i];
        if( i === breaklen ) {
            return ref[keyval];
        }
        if( !ref[keyval] ) {
            return undefined;
        } 
        ref = ref[keyval];
        if( !ref || typeof ref !== 'object' ) {
            return undefined;
        } 
    }
}

function rmStateBinding(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    Object.keys(map).forEach(key => {
        rmsub(key, rmsublist.get(self)[key]);
    });
}

export function bindState(self, opt) {
    let map;
    if( opt )
        map  = opt;
    else if( config.bindings )
        map  = config.bindings[fwcname(self)];
    else
        return;
    let id, statecb;
    rmsublist.set(self, {});
    const ref = rmsublist.get(self)
    let frameworkcb =  fwsetstate(self);
    Object.keys(map).forEach(key => {
        fwinitstate(self, key, map[key]);
        statecb = (key, val) => {
            frameworkcb(key, val);
        }
        id = addsub(key, statecb);
        ref[key] = id;
    });
    let umount = self[fwumount]
    if( config.framework ) {
        if( umount ) {
            umount = umount.bind(self);
            self[fwumount] = function classDestroy() {
                rmStateBinding(self, map);
                umount();
    //console.log('has umount framework', framework, 'umount', umount, 'self', self, 'store', _data)
            };
        } else {
            self[fwumount] = function classDestroy() {
                rmStateBinding(self, map);
    //console.log('no umount framework', framework, 'umount', umount, 'self', self, 'store', _data)
            };
        }
    } else {
        console.log('default framework', framework, 'umount', umount, 'self', self)
    }
}

function reset(key, opt) {
    if(key) {
      delete _data[key];
    } else {
      _data = {}; return
    }
}

function addSharedState(bindings) {
    Object.keys(bindings).forEach(key => {
        sharedState[key] = true;
    });
}

function setSharedState(bindings) {
    let keylist = {};
    Object.keys(bindings).forEach(key => {
      const component = bindings[key];
      addSharedState( bindings[key]);
      Object.keys(component).forEach(state => {
        if( keylist[state])
            keylist[state] += 1;
        else
            keylist[state]= 1;
      });
    });
    Object.keys(keylist).forEach(key => {
        if( keylist[key]>1 )
            sharedState[key] = true;
    });
    if( debug )
        console.log('sharedState', sharedState);
}

export function setcfg(opt) {
    if( !opt ) return;
    let val;
    Object.keys(opt).forEach(key => {
        val = opt[key];
        config[key] = val;
        
        if( key === 'framework' ) {
            fwinitstate = frameworkcfg[val].initstate;
            fwsetstate = frameworkcfg[val].setstate;
            fwumount = frameworkcfg[val].umount;
            fwcname = frameworkcfg[val].cname;
        } else if( key === 'bindings' ) {
            setSharedState(val)
        } else if( key === 'sharedBindings' ) {
            addSharedState(val)
        } else if( key === 'debug' ) {
            usm.debug(val)
            debug = val;
        } else {
            console.log('not supported option ', key);
        }
    });
}

const usm = {
  setcfg,
  set,
  get,
  reset,
  rmsub,
  addsub,
  bindState,
  select: (key, opt) => {
  },
  debug: val => debug=val,
};

export default usm;
