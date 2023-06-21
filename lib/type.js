var Delta = require('@shaxpir/quill-delta');

module.exports = {
  Delta: Delta,
  type: {
    name: 'rich-text',
    // NOTE: this is the same URI as the original (non-forked) rich-text type, but we're using a forked
    // implementation of quill-delta. Normally, we would use a different URI for the sake of clarity. But
    // for ease of migration in our production environment, we're using the same URI. Beware of mixing this
    // implementation with an off-the-shelf deployment of Quill/Delta/Parchment/RichText/ShareDB!
    uri: 'http://sharejs.org/types/rich-text/v1',

    create: function (initial) {
      return new Delta(initial);
    },

    apply: function (snapshot, delta) {
      snapshot = new Delta(snapshot);
      delta = new Delta(delta);
      return snapshot.compose(delta);
    },

    compose: function (delta1, delta2) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      return delta1.compose(delta2);
    },

    diff: function (delta1, delta2) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      return delta1.diff(delta2);
    },

    transform: function (delta1, delta2, side) {
      delta1 = new Delta(delta1);
      delta2 = new Delta(delta2);
      // Fuzzer specs is in opposite order of delta interface
      return delta2.transform(delta1, side === 'left');
    },

    transformCursor: function(cursor, delta, isOwnOp) {
      return delta.transformPosition(cursor, !isOwnOp);
    },

    normalize: function(delta) {
      return delta;   // quill-delta is already canonical
    },

    serialize: function(delta) {
      return delta.ops;
    },

    deserialize: function(ops) {
      return new Delta(ops);
    },

    transformPresence: function(range, op, isOwnOp) {
      if (!range) {
        return null;
      }

      const delta = new Delta(op);
      const start = this.transformCursor(range.index, delta, isOwnOp);
      const end = this.transformCursor(range.index + range.length, delta, isOwnOp);

      return Object.assign({}, range, {
        index: start,
        length: end - start,
      });
    },

    invertWithDoc: function(delta, doc) {
      delta = new Delta(delta);
      doc = new Delta(doc);
      return delta.invert(doc);
    }

  }
};
