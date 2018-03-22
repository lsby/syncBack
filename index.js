var debugOut = require('debug')('syncBack')

module.exports = function (opt) {
	var { debug } = opt

	return function (f, back) {
		var api = {
			"next": function (err, data) {
				if (err && debug)
					debugOut(err)

				if (err)
					fx.throw(err)

				setTimeout(function () {
					step(data)
				}, 0)
			}
		}

		var fx = f(api)
		step()

		function step(data) {
			fx.next(data)
		}
	}
}