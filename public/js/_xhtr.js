(function () {
  let _0x1a = false;
  const _0x2b = 160;

  function _0x3c() {
    const _0x4d = window['outerWidth'] - window['innerWidth'] > _0x2b;
    const _0x5e = window['outerHeight'] - window['innerHeight'] > _0x2b;
    return _0x4d || _0x5e;
  }

  function _0x6f() {
    const _0x7g = Date['now']();
    debugger;
    return Date['now']() - _0x7g > 50;
  }

  function _0x8h() {
    let _0x9i = false;
    const _0xaj = new Image();
    Object['defineProperty'](_0xaj, 'id', {
      'get': function () {
        _0x9i = true;
      }
    });

    const _0xbk = document['createElement']('div');
    _0xbk['style']['display'] = 'none';
    _0xbk['appendChild'](_0xaj);
    document['body']['appendChild'](_0xbk);
    window['_0xl'] = _0xaj;

    setTimeout(function () {
      if (_0xbk['parentNode']) {
        _0xbk['parentNode']['removeChild'](_0xbk);
      }
    }, 100);

    return _0x9i;
  }

  setInterval(function () {
    const _0xcd = _0x3c();
    const _0xde = _0x6f();
    const _0xef = _0x8h();

    if ((_0xcd || _0xde || _0xef) && !_0x1a) {
      _0x1a = true;
      window['location']['href'] = 'https://www.google.com/';
    } else if (!(_0xcd || _0xde || _0xef) && _0x1a) {
      _0x1a = false;
    }
  }, 1000);
})();
