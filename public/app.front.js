function iMessage() {
	// PUT YOUR IMESSAGE PHONE NUMBER HERE:
	this.myPhoneNumber = '+';
	this.chatters = [];
	this.selectedChatter = "";

	this.doneHandler = function() {
		var chatterKeys = getKeys(this.chatters);
		$('#chats').html("");
		for (var i = 0; i < chatterKeys.length; i++) {
			$('#chats').append('<span style="text-overflow:ellipsis; font-weight: bold; font-size: 10px; background-color: #DBDDDE; margin: 2px; padding: 4px; font-style: bold; border-bottom: 1px black solid;  border-radius: 10px;" onclick=\'imessage.displayMessages("' + chatterKeys[i] + '");\'>' + chatterKeys[i].replace(' ', '&nbsp;') + '</span>');
		}

		$('#chats').append('<span style="text-overflow:ellipsis; font-weight: bold; font-size: 10px; background-color: #DBDDDE; margin: 2px; padding: 4px; font-style: bold; border-bottom: 1px black solid; border-radius: 10px;" onclick=\'imessage.refreshThread();\'>refresh</span>');
	};

	this.displayMessages = function(chatter) {
		this.selectedChatter = chatter;
		$('#chatMessages').html("");
		var alt = true;
		for (var i = 0; i < this.chatters[chatter].length; i++) {
			if (this.chatters[chatter][i].id === this.myPhoneNumber) {
				$('#chatMessages').append('<div style="background-color: #007AFF; margin: 4px; padding: 8px; color: white; border-radius: 10px;"> <b>me</b>: ' + this.chatters[chatter][i].text + '</div>');
			} else {
				$('#chatMessages').append('<div style="background-color: #DBDDDE; margin: 4px; padding: 8px; color: black; border-radius: 10px;"><b>' + this.selectedChatter + "</b>: " + this.chatters[chatter][i].text + '</div>');
			}

		}

		$('#chatMessages').append("<textarea rows=2 id=\"messageText\" style='margin-left: 4px; margin-right: 4px; width: 78%; height: 60px; float: left; border-radius: 10px; border: 1px solid #898C90'></textarea><div style='width: 50px; height: 35px; padding: 5px; padding-top: 17px; background-color: #DBDDDE; border-radius: 10px; float: right; text-align: center;' onclick='imessage.sendMessage()'>Send</div>");
		setTimeout( function() {
			$('html, body').scrollTop( $(document).height() );
		}, 500);
	};

	this.sendMessage = function() {
		var message = $('#messageText').val();
		var chatterid = this.chatters[this.selectedChatter][0].id;
		var chatter = this.selectedChatter;

		$.post( "/sendMessage",
		       {
		    		sendTo: chatterid.replace('+',''),
		       		sendToName: chatter,
		       		sendText: message
		       	}
		).done(function(data) {
			$('#messageText').val("");
			this.refreshThread();
		}.bind(this));
	};

	this.getMessages = function() {
		this.chatters = [];
		$.get("/getMessages", function(data) {
			data = JSON.parse(data);
			for (var i = 0; i < data.messages.message.length; i++) {
				var message = data.messages.message[i];
				if (typeof(this.chatters[message.name[0]]) !== "object") {
					this.chatters[message.name[0]] = [];
				}

				this.chatters[message.name[0]].push({ "chatter" : message.name[0], "text" : message.text[0], "id" : message.id[0] });
			}
			setTimeout(function() {
				this.doneHandler();
			}.bind(this), 50);

		}.bind(this));
	};

	this.refreshThread = function() {
		this.getMessages();
		setTimeout(function() {
			this.displayMessages(this.selectedChatter);
		}.bind(this), 1000);
	};

	this.getMessages();
}
var imessage;

$(document).ready(function() {
	$.ajaxSetup({
	    // Disable caching of AJAX responses
	    cache: false
	});
	$('html, body').animate({
        scrollTop: 0
    }, 50);
	imessage = new iMessage();
});

function getKeys(obj) {
    var keys = [];

    for (var key in obj) {
        if (obj.hasOwnProperty(key)) {
            keys.push(key);
        }
    }

    return keys;
}