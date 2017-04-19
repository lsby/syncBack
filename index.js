exports.run = function (f, back) {
	var api = {
		"next": function (err, data) {
			api.err = err
			setTimeout(function () {
				step(data)
			}, 0)
		},
		"nextOne": function (data) {
			setTimeout(function () {
				step(data)
			}, 0)
		},
		"return": function (err, data) {
			setTimeout(function () {
				fx.return()
				end(err, data)
			}, 0)
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