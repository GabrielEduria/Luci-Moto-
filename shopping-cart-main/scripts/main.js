const cards = document.querySelectorAll('.card');

cards.forEach(card => {
	const colors = card.querySelectorAll('.color');
	const watchs = card.querySelectorAll('.watch-img');

	function changeColor() {
			let color = this.getAttribute('color');
			let watch = card.querySelector(`.watch-img[color="${color}"]`);

			colors.forEach(c => c.classList.remove('active'));
			this.classList.add('active');

			watchs.forEach(s => s.classList.remove('show'));
			watch.classList.add('show');
	}

	colors.forEach(c => c.addEventListener('click', changeColor));
});

