const auth = 'k_hplwhdpx'; // mainazarov
// const auth = 'k_7czxtzqi'; // islambek
// const auth = 'k_7ufla6tk' // salim
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
		res = await fetch(`https://imdb-api.com/API/AdvancedSearch/${auth}?groups=top_100`);
		data = await res.json();
		data = data.results;
	} else {
		res = await fetch(`https://imdb-api.com/en/API/${value}/${auth}`);
		data = await res.json();
		data = data.items;
	}

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
		if (el.getAttribute('id') == 'favorites') {
			if (favorites) {
				showLocalStorage()
			}
		} else {
			const val = el.getAttribute('id');
			getData(val);
		}
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
			favoriteBtn.classList.remove('active');
		} else {
			favorites.push(item);
			favoriteBtn.classList.add('active');
		}
	}
	localStorage.setItem('favorites', JSON.stringify(favorites));
}
getData();
if (window.screen.width < 460) {
	list.style = "grid-template-columns: 1fr;";
} else if (window.screen.width < 560) {
	list.style = "grid-template-columns: repeat(2, 1fr);";
} else if (window.screen.width < 768) {
	list.style = "grid-template-columns: repeat(3, 1fr)";
} else if (window.screen.width < 1024) {
	list.style = "grid-template-columns: repeat(4, 1fr)";
} else {
	list.style = "grid-template-columns: repeat(5, 1fr)";
}
window.addEventListener('resize', () => {
	if (window.screen.width < 460) {
		list.style = "grid-template-columns: 1fr;";
	} else if (window.screen.width < 560) {
		list.style = "grid-template-columns: repeat(2, 1fr);";
	} else if (window.screen.width < 768) {
		list.style = "grid-template-columns: repeat(3, 1fr)";
	} else if (window.screen.width < 1024) {
		list.style = "grid-template-columns: repeat(4, 1fr)";
	} else {
		list.style = "grid-template-columns: repeat(5, 1fr)";
	}
})
// localStorage.clear()