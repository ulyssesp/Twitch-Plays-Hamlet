var io = require('socket.io'),
	connect = require('connect'),
	app = connect().use(connect.static('public')).listen(8000),
	room = io.listen(app);

var ID = 0,
	emotionListLength;

var votedIds = [];


room.sockets.on('connection', function(socket){

	socket.emit('entrance', {
		message:'Welome to Twitch Plays Hamlet. Choose an emotion for our actors.',
		id: ID
	});
	ID++;

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
})
