var io = require('socket.io'),
	connect = require('connect'),
	app = connect().use(connect.static('public')).listen(8000),
	room = io.listen(app);

var emotionListLength;


var votedIds = [];


room.sockets.on('connection', function(socket){
	// From http://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
	function guid () {
		function s4() {
			 return Math.floor((1 + Math.random()) * 0x10000);
		};
		return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4() + s4();
	}

	var id = guid();

	socket.emit('entrance', {
		message:'Welome to Twitch Plays Hamlet. Choose an emotion for our actors.',
		id: id,
	});

	socket.on('emotions', function(data){
		emotionListLength = data.l;
		console.log("There are this many emotions: " + emotionListLength);

		(function(){
			socket.emit('newEmotion', {emotionOne: Math.floor(Math.random() * emotionListLength),
			emotionTwo: Math.floor(Math.random() * emotionListLength)})
		})();

		setInterval(function(){
			socket.emit('newEmotion', {emotionOne: Math.floor(Math.random() * emotionListLength),
			emotionTwo: Math.floor(Math.random() * emotionListLength)})
			votedIds = [];
		}, 3000)
	})

	socket.on('vote', function(data){
		// Compatibility for < ES5
		if(votedIds.indexOf === undefined) {
			console.log("Compatibility");
			for(var i=0; i < votedIds.length; i++) {
				if(votedIds[i] === data.id) return;
			}
		}
		else if(votedIds.indexOf(data.id) != -1){
			return;
		}

		console.log(data.vote);
		votedIds.push(data.id);
	})
});
