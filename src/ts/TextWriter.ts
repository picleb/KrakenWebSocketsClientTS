class TextWriter{
	private textDestinationContainer: HTMLElement = undefined;
	private animationDelay: number = 40;
	private htmlWrapperTag: string = 'p';

	constructor(destinationId: string) {
		this.setDestination(destinationId);
	}

	public setDestination(destinationId: string): void {
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

	public async writeJson(text: string|JSON, animationMultiplier:number = 0.4) {
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

	//FIXME improve this. Either a function for writing arrays, or a condition to go to the next item after the previous one is over
	public async writeHtml(text: string|Array<string>, animationMultiplier:number = 1) {
		let targetElement: HTMLElement;

		if(typeof text == 'object') {
			for(var x in text) {
				targetElement = this.getTargetElement();
				for(let i = 0; i < text[x].length; i++) {
					await this.sleepAnimationDelay(animationMultiplier);

					this.writeHtmlChar(text[x].charAt(i), targetElement);
				}
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
		return new Promise(resolve => setTimeout(resolve, this.animationDelay * multiplier));
	}
}

export { TextWriter };
