var debugOut = require('debug')('syncBack')

module.exports = function (opt) {
	var { debug } = opt

	return function (f, back) {
		var api = {
			"next": function (err, data) {
				if (err)
					return _throw(err)

				setTimeout(function () {
					step(data)
				}, 0)
			}
		}

		var fx = f(api)
		step()

		function step(data) {
			try {
				fx.next(data)
			} catch (e) {
				_throw(e)
			}
		}
		function _throw(err) {
			if (debug)
				debugOut(err)
			fx.throw(err)
		}
	}
}