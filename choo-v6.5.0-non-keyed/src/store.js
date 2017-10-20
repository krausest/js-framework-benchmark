const buildData = require('./utils').buildData;

module.exports = function(state, emitter) {
  state.data = [];
  state.selected = false;

  emitter.on('run', function() {
    state.data = buildData(1000);
    state.selected = undefined;
    emitter.emit('render');
  });

  emitter.on('add', function() {
    state.data = state.data.slice().concat(buildData(1000));
    state.selected = undefined;
    emitter.emit('render');
  });

  emitter.on('runLots', function() {
    state.data = state.data.slice().concat(buildData(10000));
    state.selected = undefined;
    emitter.emit('render');
  });

  emitter.on('clear', function() {
    state.data = [];
    state.selected = undefined;
    emitter.emit('render');
  });

  emitter.on('update', function() {
    for (let i = 0; i < state.data.length; i += 10) {
      state.data[i].label += ' !!!';
    }
    emitter.emit('render');
  });

  emitter.on('swapRows', function() {
    if (state.data.length > 10) {
      const a = state.data[4];
      state.data[4] = state.data[9];
      state.data[9] = a;
    }
    emitter.emit('render');
  });

  emitter.on('select', function(params) {
    state.selected = params.id;
    emitter.emit('render');
  });

  emitter.on('delete', function(params) {
    const idx = state.data.findIndex(d => d.id == params.id);
    state.data.splice(idx, 1);
    emitter.emit('render');
  });
};
