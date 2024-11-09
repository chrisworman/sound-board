class SoundBoardApp {
	constructor() {
		this.sprite = {
			// fucking_guy: [0, 1188],
			// what_have_you_done: [2000, 1762],
			no_cookies: [4000, 3031],
			bone_broth: [8000, 21500],
			its_illegal: [31000, 2125],
			gimmie_dat: [35500, 750],
			no_table_questions: [36250, 2688],
			'i_can\'t_know_tables': [38938, 2938],
			'and I\'m fucking scared': [41876, 3281],
		};
		this.currentlyPlayingSpriteName = null;
		document.getElementById('startButton').addEventListener('click', () => {
			this.run();
		});
		this.buttons = new Map();
	}

	run() {
		document.getElementById('startButton').remove();
		this.sound = new Howl({
			src: ["sound-board-sprite.mp3"],
			sprite: this.sprite,
		});
		this.sound.on('end', () => {
			this.setButtonState(this.currentlyPlayingSpriteName, false);
		});
		const buttonsElement = document.getElementById("buttons");
		for (let spriteName in this.sprite) {
			const button = document.createElement("button");
			button.innerText = spriteName.replace(/_/g, " ");
			button.addEventListener("click", () => {
				this.handleButtonClick(spriteName);
			});
			this.buttons.set(spriteName, button);
			buttonsElement.appendChild(button);
		}
	}

	handleButtonClick(spriteName) {
		if (this.currentlyPlayingSpriteName) {
			this.sound.stop();
			this.setButtonState(this.currentlyPlayingSpriteName, false);
		}
		this.sound.play(spriteName);
		this.currentlyPlayingSpriteName = spriteName;
		this.setButtonState(spriteName, true);
	}

	setButtonState(spriteName, isPlaying) {
		const button = this.buttons.get(spriteName);
		if (isPlaying) {
			button.classList.add('playing');
		} else {
			button.classList.remove('playing');
		}
	}
}

new SoundBoardApp();
