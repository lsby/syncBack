exports.run = function (f, back) {
	var api = {
		"next": function (err, data) {
			api.err = err
			process.nextTick(function () {
				step(data)
			})
		},
		"nextOne": function (data) {
			process.nextTick(function () {
				step(data)
			})
		},
		"return": function (err, data) {
			process.nextTick(function () {
				fx.return()
				end(err, data)
			})
		}
	}

	var fx = f(api)
	step()

	function step(data) {
		fx.next(data)
	}
	function end(err, data) {
		if (back != null)
			back(err, data, api)
	}
}