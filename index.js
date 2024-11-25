class SoundBoardApp {
	constructor(spriteConfig) {
		this.sprite = spriteConfig;
		this.currentlyPlayingSpriteName = null;
		this.buttons = new Map();
		document.getElementById('startButton').addEventListener('click', () => {
			this.run();
		});
	}

	run() {
		document.getElementById('startButton').remove();

		this.sound = new Howl({
			src: ['sprite.mp3'],
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

fetch('./sprite.json')
	.then(res => res.json())
	.then(spriteConfig => new SoundBoardApp(spriteConfig))
	.catch(error => console.error(error));
