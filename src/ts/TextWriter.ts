class TextWriter{
	private textDestinationContainer: HTMLElement = undefined;
	private animationDelay: number = 50;	//Sleep delay after writing a character during the animation
	private htmlWrapperTag: string = 'p';	//HTML tag used to wrap characters during the animation
	

	constructor(destinationId: string) {
		this.setDestination(destinationId);
	}

	private setDestination(destinationId: string): void {
		this.textDestinationContainer = document.getElementById(destinationId);
		console.log(`TextWriter destination is set to ${destinationId}`);
	}

	private getTargetElement(): HTMLElement {
		let targetElement: HTMLElement = this.textDestinationContainer;

		if(this.htmlWrapperTag) {
			this.textDestinationContainer.insertAdjacentHTML('beforeend', `<${this.htmlWrapperTag}></${this.htmlWrapperTag}>`);
			targetElement = document.querySelector('#' + this.textDestinationContainer.id + ` ${this.htmlWrapperTag}:last-of-type`);
		}

		return targetElement;
	}

	public async writeJson(text: string|JSON|Event, animationMultiplier:number = 0.4) {
		if(typeof text == 'string')
			text = JSON.parse(text);

		text = JSON.stringify(text, null, 2);
		this.textDestinationContainer.insertAdjacentHTML('beforeend', '<pre></pre>');
		let targetElement: HTMLElement = this.textDestinationContainer.querySelector('pre:last-of-type');

		for(let i = 0; i < text.length; i++) {
			await this.sleepAnimationDelay(animationMultiplier);

			this.writeChar(text.charAt(i), targetElement);
		}
	}

	public async writeHtml(text: string|Array<string>, animationMultiplier:number = 1) {
		let targetElement: HTMLElement;

		if(typeof text == 'object') {
			for(var x in text) {
				await this.writeHtml(text[x], animationMultiplier);
			}
		}
		else {
			targetElement = this.getTargetElement();
			for(let i = 0; i < text.length; i++) {
				await this.sleepAnimationDelay(animationMultiplier);

				this.writeHtmlChar(text.charAt(i), targetElement);
			}
		}
	}

	public async skipAnimation() {
		let delay = this.animationDelay;
		this.animationDelay = 0;
		await new Promise(r => setTimeout(r, delay));
		this.animationDelay = delay;
	}

	private writeHtmlChar(char: string, target: HTMLElement) {
		target.insertAdjacentHTML('beforeend', `<span>${char}</span>`);
		this.scrollDown();
	}

	private writeChar(char: string, target: HTMLElement) {
		target.insertAdjacentText('beforeend', `${char}`);
		this.scrollDown();
	}

	private scrollDown() {
		this.textDestinationContainer.parentElement.scrollTop = this.textDestinationContainer.parentElement.scrollHeight;
	}

	private sleepAnimationDelay(multiplier: number = 1) {
		if(this.animationDelay * multiplier == 0) {
			return true;
		}
		return new Promise(resolve => setTimeout(resolve, this.animationDelay * multiplier));
	}
}

export { TextWriter };
