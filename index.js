var debugOut = require('debug')('syncBack')

module.exports = function (opt) {
	var { debug } = opt || {}

	return function (f, back) {
		var api = {
			next: function (err, data) {
				if (err) {
					_debugOut(err)
					fx.throw(err)
				}

				step(data)
			}
		}
		var fx = f(api)
		step()

		function step(data) {
			setTimeout(function () {
				try {
					var c = fx.next(data)
					if (c.done == true)
						_back(null, c.value)
				} catch (err) {
					_debugOut(err)
					_back(err)
				}
			}, 0)
		}
		function _back(err, data) {
			if (back != null)
				back(err, data)
		}
		function _debugOut(err) {
			if (debug)
				debugOut(err)
		}
	}
}