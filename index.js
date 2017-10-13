const si = require('systeminformation')
const  http = require('http')

const port = 6022

/*
si.cpu(function(data) {
    console.log('CPU-Information:');
    console.log(data);
})

si.networkInterfaces(function(data) {
    console.log(data)
})

si.currentLoad(function (data) {
	console.log(data)
})

si.services(function (data) {
	console.log(data)
})

si.processLoad('node', function (data) {
	console.log(data)
})
*/

function handler (req, res) {

	switch (req.url) {
		case "/":
			root(res)
			break;
		case "/cpuLoad":
			cpuLoad(res)
			break;
		case "/net":
			net(res)
			break;
		case "/ps":
			ps(res)
			break;
		case "/services":
			services(res)
			break;
		case "/mem":
			mem(res)
			break;
		case "/card" :
			card(res)
			break;
		default:
 			res.write(JSON.stringify(req.url) + "not valid ")
			res.end()
	}
}

function cpuLoad (res) {
	si.currentLoad( function (data) {
		reply (res, data)
	})
}
function root (res) {
	si.osInfo( function  (data)  {
		reply (res, data)
	})
}

function card (res) {
	var data =  {}
	var calls = {started:3,done:0}
	calls.check = function () {
		if (calls.started == calls.done) {
			reply(res,data)
		}
	}
        si.osInfo( function  (result)  {
                data.osInfo = result
		calls.done++
		calls.check()
        })
        si.currentLoad( function (result) {
                data.currentLoad = result
		calls.done++
		calls.check()
        })
        si.mem(function (result) {
                data.mem = result
		calls.done++
		calls.check()
        })

}


function net (res)  {
	si.networkInterfaces(function(data) {
		reply(res,data)
	})
}

function ps (res) {
	si.processes(function(data) {
		reply(res,data)
	})
}

function services (res) {
	si.services(function (data) {
		reply(res,data)
	})
}

function mem (res) {
	si.mem(function (data) {
		reply(res,data)
	})
}

function reply  (res, data) {
	res.writeHead(200, {'Content-Type': 'application/json'})
	res.write(JSON.stringify(data))
	res.end()
}


const  server = http.createServer(handler)

server.listen(port, function (err) {
	if (err) {
		return console.log(err)
	}
	console.log('server is on '  +  port)
})
