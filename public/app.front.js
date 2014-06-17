function iMessage() {
	// PUT YOUR IMESSAGE PHONE NUMBER HERE:
	this.myPhoneNumber = '+';
	this.chatters = [];
	this.selectedChatter = "";

	this.doneHandler = function() {
		var chatterKeys = getKeys(this.chatters);
		$('#chats').html("");
		for (var i = 0; i < chatterKeys.length; i++) {
			$('#chats').append('<span style="text-overflow:ellipsis; font-weight: bold; background-color: #EEE; margin: 4px; padding: 8px; border: 1px gray solid; font-style: bold; box-shadow: 2px 2px 5px #000;" onclick=\'imessage.displayMessages("' + chatterKeys[i] + '");\'>' + chatterKeys[i].replace(' ', '&nbsp;') + '</span>');
		}

		$('#chats').append('<span style="text-overflow:ellipsis; font-weight: bold; background-color: #EEE; margin: 4px; padding: 8px; border: 1px gray solid; font-style: bold; box-shadow: 2px 2px 5px #000;" onclick=\'imessage.refreshThread();\'>refresh</span>');
	};

	this.displayMessages = function(chatter) {
		this.selectedChatter = chatter;
		$('#chatMessages').html("");
		var alt = true;
		for (var i = 0; i < this.chatters[chatter].length; i++) {
			if (this.chatters[chatter][i].id === this.myPhoneNumber) {
				$('#chatMessages').append('<div style="background-color: #EEE; margin: 2px; padding: 4px; border: 1px gray solid;"> <b>me</b>: ' + this.chatters[chatter][i].text + '</div>');
			} else {
				$('#chatMessages').append('<div style="background-color: #EEE; margin: 2px; padding: 4px; border: 1px gray solid;"><b>' + this.selectedChatter + "</b>: " + this.chatters[chatter][i].text + '</div>');
			}

		}

		$('#chatMessages').append("<br><input type=\"text\" id=\"messageText\" style='width: 100%; height: 30px;'><br><div style='border: 1px black solid; padding: 5px;' onclick='imessage.sendMessage()'>send message</div>");

		$('html, body').animate({
	        scrollTop: $("#messageText").offset().top
	    }, 50);
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
		}.bind(this), 100);
	};

	this.getMessages();
}
var imessage;

$(document).ready(function() {
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