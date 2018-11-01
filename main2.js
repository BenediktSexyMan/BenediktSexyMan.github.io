"use strict"


let messages = [
	"...",
	"Hey! That's my apple!",
	"Stop that!",
	"What's wrong with you?!",
	"Stop eating my apples!",
	"You're really getting on my nerves!",
	"Didn't your mom tell you not to steal?!",
	"You can't still be hungry!",
	"What did I do to deserve this?!",
	"How am I supposed to feed my family if you keep eating my apples?!",
	"Would you stop if I ask nicely?",
	"Pretty please.",
	"You're just a really bad person you know that.",
	"How about I go and eat your livelyhood?",
	"You know what just keep eating em' I'll count for you.",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"7",
	"8",
	"9",
	"10",
	"Shit I lost count. Let's start again.",
	"1",
	"2",
	"3",
	"4",
	"5",
	"6",
	"Ahh shit fuck this.",
	"So how's your day been?",
	"That's good I guess.",
	"Mine's not been too good.",
	"Wanna do something this weekend?... That is if you're not busy...",
	"Ok great. I know this great diner we can go to. They have the best apple pie.",
	"You know what... I think I love you.",
	"Let's get married.",
	"I think this relationship isn't gonna work. You never say anything.",
	"Are you even listening?! Stop eating apples if you are!",
	"You know what I don't even love you anymore!",
	"I'm gonna give you the silent treatment",
	"...",
	"...",
	"...",
	"...",
	"Stop eating those apples you asshole!",
	"You know what... I'm just gonna use this memory eraser and erase all of this. I hope when I'm done you'll be gone!",
	"*Erases cookies*"
];

let mi = 0; // Message Index

let message = document.querySelector('h1');

let abs = Math.abs;

let canvas = document.querySelector('canvas');
let ctx = canvas.getContext('2d');

let width = canvas.width = window.innerWidth;
let height = canvas.height = window.innerHeight;

function random(min,max) {
	return Math.floor(Math.random()*(max-min)) + min;
}

let keys = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    keys[e.keyCode] = e.type == 'keydown';
}

class Timer {
	constructor(milli = null) {
		if(milli !== null) {
			this.start = new Date().getTime();
			this.milli = milli;
			this.set = true;
		}
		else {
			this.start = null;
			this.milli = null;
			this.set = false;
		}
	}
	
	setTimer(milli) {
		this.start = new Date().getTime();
		this.milli = milli;
		this.set = true;
	}
	
	restart() {
		this.start = new Date().getTime();
	}
	
	passed() {
		return (new Date().getTime()) >= this.start + this.milli;
	}
}

class Vector2 {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.data = [x, y];
	}
	
	right() {
		return new Vector2(1,0);
	}
	
	left() {
		return new Vector2(-1,0);
	}
	
	right() {
		return new Vector2(0,1);
	}
	
	up() {
		return new Vector2(0,-1);
	}
	
	mult(other) {
		if(typeof other == Number) {
			this.x   *= other;
			this.y   *= other;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Vector2") {
			this.x   *= other.x;
			this.y   *= other.y;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Array") {
			this.x   *= other[0];
			this.y   *= other[1];
			this.data = [this.x, this.y];
		}
	}
	
	sub(other) {
		if(typeof other == Number) {
			this.x   /= other;
			this.y   /= other;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Vector2") {
			this.x   /= other.x;
			this.y   /= other.y;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Array") {
			this.x   /= other[0];
			this.y   /= other[1];
			this.data = [this.x, this.y];
		}
	}
	
	add(other) {
		if(typeof other == Number) {
			this.x   += other;
			this.y   += other;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Vector2") {
			this.x   += other.x;
			this.y   += other.y;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Array") {
			this.x   += other[0];
			this.y   += other[1];
			this.data = [this.x, this.y];
		}
	}
	
	sub(other) {
		if(typeof other == Number) {
			this.x   -= other;
			this.y   -= other;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Vector2") {
			this.x   -= other.x;
			this.y   -= other.y;
			this.data = [this.x, this.y];
		}
		else if(other.__proto__.constructor.name == "Array") {
			this.x   -= other[0];
			this.y   -= other[1];
			this.data = [this.x, this.y];
		}
	}
}

class Rigidbody {
	constructor(position, size, velocity, tag="", color="white") {
		if(position.__proto__.constructor.name == "Array") {
			position = new Vector2(position[0], position[1]);
		}
		if(size.__proto__.constructor.name == "Array") {
			size = new Vector2(size[0], size[1]);
		}
		if(velocity.__proto__.constructor.name == "Array") {
			velocity = new Vector2(velocity[0], velocity[1]);
		}
		this.x      = position.x;
		this.y      = position.y;
		this.width  = size.x;
		this.height = size.y;
		this.pos    = position;
		this.size   = size;
		this.vel    = velocity;
		this.tag    = tag;
		this.color  = color;
		this.exists = true;
	}
	
	addForce(other) {
		this.vel.add(other);
	}
	
	update() {
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.pos = new Vector2(this.x, this.y);
	}
	
	draw() {
		ctx.beginPath();
		ctx.fillStyle = this.color;
		ctx.rect(this.x, this.y, this.width, this.height);
		ctx.fill();
	}
	
	onCollision(other) {
		
	}
}

class Player extends Rigidbody {
	constructor(position, size, velocity, tag="", color="white") {
		super(position, size, velocity, tag, color);
		this.acc = 1;
		this.maxspeed = 10;
		this.bSpeed = 10;
	}
	
	update() {
		this.x += this.vel.x;
		this.y += this.vel.y;
		this.pos = new Vector2(this.x, this.y);
		let v = new Vector2(0,0);
		if(keys[65] && this.vel.x > -this.maxspeed) { // a
			v.x -= this.acc;
		}
		else if(!keys[65] && this.vel.x < 0) {
			v.x -= this.vel.x/2;
		}
		if(keys[68] && this.vel.x < this.maxspeed) { // d
			v.x += this.acc;
		}
		else if(!keys[68] && this.vel.x > 0) {
			v.x -= this.vel.x/2;
		}
		if(keys[87] && this.vel.y > -this.maxspeed) { // w

			v.y -= this.acc;
		}
		else if(!keys[87] && this.vel.y < 0) {
			v.y -= this.vel.y/2;
		}
		if(keys[83] && this.vel.y < this.maxspeed) { // s
			v.y += this.acc;
		}
		else if(!keys[83] && this.vel.y > 0) {
			v.y -= this.vel.y/2;
		}
		this.addForce(v);
	}
	
	onCollision(other) {
		if(other.tag === "top wall") {
			this.addForce(new Vector2(0,this.bSpeed));
		}
		if(other.tag === "right wall") {
			this.addForce(new Vector2(-this.bSpeed,0));
		}
		if(other.tag === "bottom wall") {
			this.addForce(new Vector2(0,-this.bSpeed));
		}
		if(other.tag === "left wall") {
			this.addForce(new Vector2(this.bSpeed,0));
		}
	}
}

class Collectable extends Rigidbody {
	constructor(position) {
		super(position, [20,20], [0,0], "apple", "red");
		this.points = 1.01;
	}
	
	onCollision(other) {
		if(other.tag === "player") {
			mi++;
			if(mi >= messages.length)
				mi = 0;
			message.textContent = messages[mi];
			this.exists = false;
		}
	}
}


let objects = [];
objects.findTag = function listFindTag(tag) {
	for(let i = 0; i < this.length; i++) {
		if(this[i].tag === tag) {
			return i;
		}
	}
	return null;
}

objects.push(new Player([width/2, height/2], [50, 50], [0,0], "player", "white"));
let p = 0;

objects.push(new Rigidbody([0,0], [width,10],[0,0], "top wall", "blue"));
objects.push(new Rigidbody([width-10,0], [10,height],[0,0], "right wall", "blue"));
objects.push(new Rigidbody([0,height-10], [width,10],[0,0], "bottom wall", "blue"));
objects.push(new Rigidbody([0,0], [10,height],[0,0], "left wall", "blue"));

let drawrate  = new Timer();
let tickrate  = new Timer();
let spawnrate = new Timer(0);
let frameCount = 0;

function update(tickrate) {
		p.update();
}

function loop() {
	/*if(!drawrate.set || !tickrate.set) {
		drawrate.setTimer(1000/1000);
		tickrate.setTimer(1000/60);
	}
	
	while(true) {
		if(tickrate.passed()) {
			tickrate.restart();
			p.update();
		}
		
		if(drawrate.passed()) {
			drawrate.restart();
			ctx.fillStyle = 'rgba(0,0,0,0.25)';
			ctx.fillRect(0,0,width,height);
			p.draw();
			requestAnimationFrame(loop);
			break;
		}
	}*/
	
	frameCount++;
	
	ctx.fillStyle = 'rgba(0,0,0,0.5';
	ctx.fillRect(0,0,width,height);
	
	if(spawnrate.passed()) {
		spawnrate.setTimer(2000);
		objects.push(new Collectable([random(50,width-50), random(50,height-50)]));
	}
	
	for(let i = objects.length-1; i >= 0; i--) {
		if(objects[i].exists) {	
			objects.forEach(function objectsForEachInner(elem2) {
				if (objects[i] !== elem2 && elem2.exists &&
					objects[i].x < elem2.x + elem2.width &&
					objects[i].x + objects[i].width > elem2.x &&
					objects[i].y < elem2.y + elem2.height &&
					objects[i].height + objects[i].y > elem2.y) {
						objects[i].onCollision(elem2);
						elem2.onCollision(objects[i]);
				}
			});
			objects[i].update();
			objects[i].draw();
		}
		else {
			objects.splice(i,1);
		}
	}
	requestAnimationFrame(loop);
}

loop();