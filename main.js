function Terminal(ctx){
	this.linePrompt = '>'
	this.currentLine = '';
	this.lineHistory = [];
	this.searchEng = "https://www.google.co.uk/search?q=";
	window.addEventListener('keydown', this.backspaceHandler.bind(this), false);
	window.addEventListener('keypress', this.keyHandler.bind(this), false);
	window.addEventListener('resize', this.resizeHandler.bind(this), false);
	this.reqs = [];
	this.help = [
		'**************************************************',
		'*fnd <search string>      -- google shit         *',
		'*chn <board> <opt search> -- go to board         *',
		'*hlp                      -- display this message*',
		'**************************************************'
	]
	this.maxHist = 20;
	//gfx
	this.ctx = ctx;
	console.log('THIS REFERS TO: '+this);
}

Terminal.prototype.keyHandler = function(e){
	console.log('key handler called.');
	e = e || window.event;
	console.log('got event '+e);
	console.log('THIS REFERS TO: '+this);
	if(e.keyCode == 13){
		this.lineHistory.push(this.currentLine);
		this.currentLine = '';
		console.log('enter pressed. Line history: '+this.lineHistory);
		rtnStatus = this.evalCmd(this.lineHistory[this.lineHistory.length-1]);
		this.lineHistory.push(rtnStatus);
		
		hislen = this.lineHistory.length;
		lineDiff = hislen - this.maxHist
		if(lineDiff > 0){
			this.lineHistory = this.lineHistory.slice(lineDiff, hislen);
		}
	}else{
		console.log('enter not pressed, adding key '+e.charCode+'to keyboard.');
		this.currentLine += String.fromCharCode(e.keyCode || e.charCode);
		console.log('current line: '+this.currentLine);
	}
}

Terminal.prototype.backspaceHandler = function(e){
	console.log('keydown found');
	console.log('got event '+e);
	console.log('THIS REFERS TO: '+this);
	if(e.keyCode == 8){
		console.log('backspace!');
		this.currentLine = this.currentLine.substring(0, this.currentLine.length-1); //thisthisthis
	}else if(e.keyCode == 32){
		this.currentLine += String.fromCharCode(e.keyCode || e.charCode);
		console.log('current line: '+this.currentLine);
	}
}

Terminal.prototype.resizeHandler = function(e){
	console.log('window resized');
	//unfuck everything
	winWidth = window.innerWidth-3;
	winHeight = window.innerHeight-3;
	document.getElementById('main').setAttribute('width', winWidth);
	document.getElementById('main').setAttribute('height', winHeight);
	
	//it's javascript, who cares where I'm pulling my variables from :^)
	horoW = winWidth/3;
	horoH = (horo.naturalHeight/horo.naturalWidth)*horoW;
}

Terminal.prototype.start = function(contxt){
	overlay = new Image();
	horo = new Image();
	overlay.src = 'overlay.png';
	horo.src = 'horo.png';
	
	//arbitrary values ahoy
	winWidth = window.innerWidth-3;
	winHeight = window.innerHeight-3;
	
	linespace = 25;
	fntsz = 25;
	
	document.getElementById('main').setAttribute('width', winWidth);
	document.getElementById('main').setAttribute('height', winHeight);
	
	//draw background
	ctx.fillStyle = '#CCCCCC';
	ctx.fillRect(0, 0, winWidth, winHeight);
	//draw image
	horo.onload = function(){
		horoW = winWidth/3;
		horoH = (horo.naturalHeight/horo.naturalWidth)*horoW;

	}
	setInterval(function(termObj){
		ctx.fillStyle = '#CCCCCC';
		ctx.fillRect(0, 0, winWidth, winHeight);
		
		ctx.font = fntsz+'px monospace';
		ctx.fillStyle = '#00CC00';
		for(var i = 0; i < termObj.lineHistory.length; ++i){
			ctx.fillText('>'+termObj.lineHistory[i], 20, (i*linespace)+40);
		}
		ctx.fillText(termObj.linePrompt+termObj.currentLine, 20, (termObj.lineHistory.length*linespace)+40);
		ctx.drawImage(horo, winWidth-horoW, winHeight-horoH, horoW, horoH);
		ctx.drawImage(overlay, 0, 0, winWidth, winHeight);
	}, 100, this);
}


//COMMANDS
Terminal.prototype.evalCmd = function(cmdstr){
	cmdstr = cmdstr.split(' ');
	cmd = cmdstr[0]
	str = cmdstr.slice(1, cmdstr.length);
	status = '**CMDFAIL**';
	switch(cmd){
		case 'fnd':
			srch = str.toString().replace(/\,/g, ' ');
			window.open(this.searchEng+srch);
			status = '**FNDEXEC**';
			break;
		case 'chn':
			srch = str.slice(1, str.length).toString().replace(/\,/g, ' ');
			srch = srch? 'catalog#s='+srch : '';
			window.open('http://boards.4chan.org/'+str[0]+'/'+srch);
			status = '**CHNEXEC**';
			break;
		case 'hlp':
			this.lineHistory = this.lineHistory.concat(this.help);
			status = '**HLPEXEC**';
	}
	return status;
}

window.onload = function(){
	//stop backspace and space from doing browser shit
	$(document).on("keydown", function(e){
		if(e.which == 8 || e.which == 32){
			e.preventDefault();
		}
	});
	var cnvs = document.getElementById('main');
	ctx = cnvs.getContext('2d');
	term = new Terminal(ctx);
	term.start();
}