function getVals(){
  let val1 = parseFloat(slider1.value);
  let val2 = parseFloat(slider2.value);
  // Neither slider will clip the other, so make sure we determine which is larger
  if     (val1 > val2 && this == slider1){slider1.value = val2;}
  else if(val1 > val2 && this == slider2){slider2.value = val1;}
  filterEvents();
}

let request = new XMLHttpRequest();
request.open('GET', 'https://apis.is/concerts', true);
let resp;
let dates;

function displayEvent(i){
	events.innerHTML += `
	<div class="event">
		<img src="${i.imageSource}">
		<p>${i.dateOfShow.toDateString().substr(4, 14)}</p>
		<h3>${i.eventDateName}</h3>
		<p class="location">Staðsetningin: ${i.eventHallName}</p>
	</div>`;
}

function filterEvents(){
	events.innerHTML = "";
	resp.forEach(function(i){
		let flag = true;
		search.value.split(" ").forEach(function(j){
			if(!i.searchString().toLowerCase().includes(j.toLowerCase())){
				flag = false;
				return;
			}
		});
		if(!all.checked){
			Array.from(checks.children).forEach(function(j){
				j = j.children[0].children[0];
				if(i.eventHallName == j.id && !j.checked){
					flag = false;
					return;
				}
			});
		}
		if(i.days < parseFloat(slider1.value) || i.days > parseFloat(slider2.value)) {
			flag = false;
		}
		if(flag) {
			displayEvent(i);
		}
	});
}

request.onload = function() {
  if (request.status >= 200 && request.status < 400) {
    // Success!

    resp = JSON.parse(request.responseText).results;

    resp.map(function(i){
    	i.dateOfShow = new Date(Date.parse(i.dateOfShow));

    	i.days = Math.floor(i.dateOfShow/86400000);

    	i.searchString = function eventSearchString(){
    		return [this.dateOfShow.toDateString(),
    				this.eventDateName,
    				this.eventHallName, 
    				this.name, 
    				this.userGroupName
    		].join(" ");
    	};

    	return i;
    });

    let done = [];

    resp.forEach(function(i){
		displayEvent(i);
		if(!done.includes(i.eventHallName)){
			checks.innerHTML += `
			<label for="${i.eventHallName}">
				<div class="checkOuter">
					${i.eventHallName}<input onchange="filterEvents()" id="${i.eventHallName}" class="check" name="check" type="radio">
				</div>
			</label>`;
			done.push(i.eventHallName);
		}
	});

	search.addEventListener("change", filterEvents);
	search.addEventListener("keyup", filterEvents);


	rangeSlider.innerHTML = `
	<input value="${resp[0].days}" min="${resp[0].days}" max="${resp[resp.length-1].days}" step="1" type="range" id="slider1">
  	<input value="${resp[resp.length-1].days}" min="${resp[0].days}" max="${resp[resp.length-1].days}" step="1" type="range" id="slider2">`
  	p1.innerHTML = `<p id="p1">${resp[0].dateOfShow.toDateString().substr(4, 14)}</p>`;
  	p2.innerHTML = `<p id="p2">${resp[resp.length-1].dateOfShow.toDateString().substr(4, 14)}</p>`;
  	for( let x = 0; x < rangeSlider.children.length; x++ ){
    	let slider = rangeSlider.children[x];
    	slider.oninput = getVals;
    	slider.oninput();
    }

  } else {
  	console.log("Error loading info");
  }
};

request.onerror = function() {
  console.log("Error loading info");
};

request.send();