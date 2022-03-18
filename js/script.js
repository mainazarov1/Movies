const auth = 'k_hplwhdpx';
// const auth = 'k_7czxtzqi';
const logo = document.getElementById('header__logo');
const nav = document.querySelector('.header__list');
const navBtn = document.querySelectorAll('.header__item');
const searchInput = document.querySelector('.header__input');
const burger = document.querySelector('.burger');
let list = document.querySelector('.hero__grid');
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
burger.addEventListener('click', e => {
	e.preventDefault();
	burger.classList.toggle('active');
	nav.classList.toggle('active');
})
function showData(data) {
	let li = document.createElement('li');
	li.classList.add('item');
	li.setAttribute('id', `${data.id}`);
	// li.setAttribute('onclick', `${preview(data)}`);
	let active = '';
	if (favorites.find(favorite => favorite.id === data.id)) {
		active = 'active';
	}
	li.innerHTML = `<img class="item__image" src="${data.image}" alt="${data.fullTitle || data.title} poster">
	<h3 class="item__title">${data.title}</h3>
	<p class="item__info"><span class="item__release">${data.year || data.description}</span></p>
	<button class="item__btn ${active || ''}" onclick="addToFavorites(${data.id})"><i class="bi bi-star-fill item__favorite"></i></button>`;
	list.appendChild(li);
}
// function preview(data) {
// 	let res = await fetch(`https://imdb-api.com/API/AdvancedSearch/${auth}?groups=top_100`);
// 	let data = await res.json();
// 	let div = ``;
	
// 	https://imdb-api.com/en/API/Title/k_7czxtzqi/tt1375666/FullActor,FullCast,Posters,Images,Trailer,Ratings,Wikipedia,
// }
// preview(data)
function showDataSearch(data) {
	let li = document.createElement('li');
	li.classList.add('item');
	li.setAttribute('id', `${data.id}`);
	li.innerHTML =
		`<img class="item__image" src="${data.image}" alt="${data.fullTitle} poster">
	<h3 class="item__title">${data.title}</h3>
	<p class="item__info"><span class="item__release">${data.year}</span>, <span class="item__genre">боевик</span></p>
	<button class="item__btn"><i class="bi bi-star-fill item__favorite"></i></button>`;
	list.appendChild(li);
}
logo.addEventListener('click', e => {
	e.preventDefault();
	getData('main');
})
async function getData(value) {
	list.innerHTML = '';
	let res;
	let data;
	if (value === 'main' || value === undefined) {
		res = await fetch(`http://imdb-api.com/API/AdvancedSearch/${auth}?groups=top_100`);
		data = await res.json();
		data = data.results;
	} else {
		res = await fetch(`http://imdb-api.com/en/API/${value}/${auth}`);
		data = await res.json();
		data = data.items;
	}
	// let res = await fetch("../DB.json")
	// 	.then(response => {
	// 		return response.json();
	// 	});
	await data.forEach((item) => showData(item));
}

async function getDataSearch(value) {
	list.innerHTML = '';
	const res = await fetch(`https://imdb-api.com/en/API/Search/${auth}/${value}`);
	let data = await res.json();
	data = data.results;
	data.map(item => showData(item));
}

async function showLocalStorage() {
	if (favorites !== null) {
		list.innerHTML = '';
		// const res = await fetch(`https://imdb-api.com/en/API/SearchAll/${auth}`);
		// let data = await res.json();
		// let res = await fetch("../DB.json")
		// 	.then(response => {
		// 		return response.json()
		// 	});
		// data = res.items;
		// data.map(item => showData(item));
		// favorites.forEach(item => showData(item));
		// console.log(favorites);
		favorites.forEach((favorite) => {
			if (favorite) {
				let li = document.createElement('li');
				li.classList.add('item');
				li.setAttribute('id', `${favorite.id}`);
				li.innerHTML =
					`<img class="item__image" src="${favorite.image}" alt="${favorite.title} poster">
				<h3 class="item__title">${favorite.title}</h3>
				<p class="item__info"><span class="item__release">${favorite.year}</span>, <span class="item__genre">боевик</span></p>
				<button class="item__btn active" onclick="addToFavorites(${favorite.id})"><i class="bi bi-star-fill item__favorite"></i></button>`;
				list.appendChild(li);
			}
		})
	}
}

navBtn.forEach(el => {
	el.addEventListener('click', e => {
		e.preventDefault();
		if (window.screen.width < 425) {
			list.style = "grid-template-columns: 1fr";
		} else {
			list.style = "grid-template-columns: repeat(5, 1fr)";
		}
		if (el.getAttribute('id') == 'favorites') {
			if (favorites) {
				showLocalStorage()
			};
			if (favorites.length == 0) {
				list.style = "grid-template-columns: 1fr";
				list.innerHTML = '<div><h4><img class="empty" src="./assets/7beefb96feac302ee313cf510fca4577-removebg-preview.png" alt="Empty"></h4></div>'
			}
		} else {
			const val = el.getAttribute('id');
			getData(val);
		}
		burger.classList.toggle('active');
		nav.classList.toggle('active');
	})
})

searchInput.addEventListener('keypress', e => {
	if (e.key === 'Enter') {
		e.preventDefault();
		const val = searchInput.value;
		getDataSearch(val);
	}
})

function addToFavorites(id) {
	let favoriteBtn = id.querySelector('.item__btn');
	let item = {
		id: id.getAttribute('id'),
		title: id.querySelector('.item__title').textContent,
		year: id.querySelector('.item__release').textContent,
		image: id.querySelector('.item__image').src,
	}
	if (favorites.length == 0) {
		favorites.push(item);
		favoriteBtn.classList.add('active');
	} else {
		if (favorites.find(val => val.id === item.id)) {
			favorites = favorites.filter(val => val.id !== item.id);
			// favorites = new Set(favorites);
			favoriteBtn.classList.remove('active');
		} else {
			favorites.push(item);
			favoriteBtn.classList.add('active');
		}
	}
	localStorage.setItem('favorites', JSON.stringify(favorites));
}
getData();
// localStorage.clear()
console.log(window.screen.width);
if (window.screen.width < 425) {
	list.style = "grid-template-columns: 1fr";
}