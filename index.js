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
		};
		this.sound = new Howl({
			src: ["sound-board-sprite.mp3"],
			sprite: this.sprite,
		});
		this.currentlyPlayingSpriteName = null;
	}

	run() {
		const buttonsElement = document.getElementById("buttons");
		for (let spriteName in this.sprite) {
			const button = document.createElement("button");
			button.innerText = spriteName.replace(/_/g, " ");
			button.addEventListener("click", () => {
				this.handleButtonClick(spriteName);
			});
			buttonsElement.appendChild(button);
		}
	}

	handleButtonClick(spriteName) {
		if (this.currentlyPlayingSpriteName) {
			this.sound.stop();
		}
		this.sound.play(spriteName);
		this.currentlyPlayingSpriteName = spriteName;
	}
}

const app = new SoundBoardApp();
app.run();
