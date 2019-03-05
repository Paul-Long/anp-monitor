'use strict';

exports = module.exports = {
  type: {
    req: 'request',
    res: 'response'
  },
  request: {
    0: 'HEART_BEAT_REQUEST',
    2: 'OS_UPLOAD_REQUEST'
  },
  response: {
    1: 'HEART_BEAT_RESPONSE',
    3: 'OS_UPLOAD_RESPONSE'
  }
};
