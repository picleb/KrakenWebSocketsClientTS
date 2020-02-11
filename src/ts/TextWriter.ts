class TextWriter{
	private textDestinationContainer: HTMLElement = undefined;
	private animationDelay: number = 50;	//Sleep delay after writing a character during the animation
	private htmlWrapperTag: string = 'p';	//HTML tag used to wrap characters during the animation
	

	/**
	 * TextWriter's constructor
	 *
	 * @param destinationId - Html id tag of element we will write into
	 */
	constructor(destinationId: string) {
		this.setDestination(destinationId);
	}

	/**
	 * Set the texts destination Element in this.textDestinationContainer
	 *
	 * @param destinationId - Html id tag of element we will write into
	 */
	private setDestination(destinationId: string): void {
		this.textDestinationContainer = document.getElementById(destinationId);
	}

	/**
	 * Create a wrapper element for the string to write and
	 * returns the HTMLElement we will actually write into.
	 *
	 * @returns HTMLElement that will receive the text to write
	 */
	private getTargetElement(): HTMLElement {
		let targetElement: HTMLElement = this.textDestinationContainer;

		if(this.htmlWrapperTag) {
			this.textDestinationContainer.insertAdjacentHTML('beforeend', `<${this.htmlWrapperTag}></${this.htmlWrapperTag}>`);
			targetElement = document.querySelector('#' + this.textDestinationContainer.id + ` ${this.htmlWrapperTag}:last-of-type`);
		}

		return targetElement;
	}

	/**
	 * Allow you to write a JSON element from a JSON argument or a string
	 * inside a <pre> HTML element.
	 *
	 * @remarks
	 * You can only use this method to write JSON like content.
	 *
	 * @param text - A JSON or JSON like element to write in the page
	 * @param animationMultiplier - Allows yo to speed up or slow down the speed of the animation
	 * @returns a Promise
	 */
	public async writeJson(text: string|JSON|Event, animationMultiplier:number = 0.4): Promise<any> {
		let toWrite: string|JSON|Event = text;

		if(typeof toWrite == 'string')
			toWrite = JSON.parse(toWrite);

		toWrite = JSON.stringify(toWrite, null, 2);
		this.textDestinationContainer.insertAdjacentHTML('beforeend', '<pre></pre>');
		const targetElement: HTMLElement = this.textDestinationContainer.querySelector('pre:last-of-type');

		for(let i = 0; i < toWrite.length; i++) {
			await this.sleepAnimationDelay(animationMultiplier);

			this.writeChar(toWrite.charAt(i), targetElement);
		}
	}

	/**
	 * Write any string or array of strings in the target HTMLElement or the TextWriter
	 *
	 * @remarks
	 * You can use this method to write any kind of content. All chars are going to be wrapped in a <span>
	 *
	 * @param text - A string or array of strings to write in the page
	 * @param animationMultiplier - Allows yo to speed up or slow down the speed of the animation
	 * @returns a Promise
	 */
	public async write(text: string|Array<string>, animationMultiplier:number = 1): Promise<any> {
		let toWrite: string|Array<string> = text;
		if(typeof toWrite == 'object') {
			for(var x in toWrite) {
				await this.write(toWrite[x], animationMultiplier);
			}
		}
		else {
			const targetElement: HTMLElement = this.getTargetElement();

			for(let i = 0; i < toWrite.length; i++) {
				await this.sleepAnimationDelay(animationMultiplier);

				this.writeHtmlChar(toWrite.charAt(i), targetElement);
			}
		}
	}

	/**
	 * Temporarily disable animations. Use this to finish writing immeditely
	 * anything that is currently being written.
	 *
	 * @returns a Promise
	 */
	public async skipAnimation(): Promise<any> {
		const delay = this.animationDelay;
		this.animationDelay = 0;
		await new Promise(r => setTimeout(r, delay));
		this.animationDelay = delay;
	}

	/**
	 * Write one character wrapped in a <span> inside the targeted element 
	 * and makes sure the container is scrolled all the way down.
	 *
	 * @remarks
	 * Maybe you should adapt the scroll behavior this to your text container ?
	 *
	 * @param char - A character to write
	 * @param target - Where the character has to be written
	 * @returns a Promise
	 */
	private writeHtmlChar(char: string, target: HTMLElement) {
		target.insertAdjacentHTML('beforeend', `<span>${char}</span>`);
		this.scrollDown();
	}

	/**
	 * Write one character inside the targeted element 
	 * and makes sure the container is scrolled all the way down.
	 *
	 * @remarks
	 * Maybe you should adapt the scroll behavior this to your text container ?
	 *
	 * @param char - A character to write
	 * @param target - Where the character has to be written
	 * @returns a Promise
	 */
	private writeChar(char: string, target: HTMLElement) {
		target.insertAdjacentText('beforeend', `${char}`);
		this.scrollDown();
	}

	/**
	 * Scrolls the parent of the text destination container all the way down
	 *
	 * @remarks
	 * Maybe you should adapt the scroll behavior this to your text container ?
	 */
	private scrollDown() {
		this.textDestinationContainer.parentElement.scrollTop = this.textDestinationContainer.parentElement.scrollHeight;
	}

	/**
	 * Sleeps by this.animationDelay * multiplier milliseconds
	 *
	 * @remarks
	 * If this.animationDelay * multiplier = 0, we skip the Sleep / setTimeout / Promise thing
	 *
	 * @param multiplier - A multiplier to speed up or slow down the animation
	 * @returns true we skip the animation or a Promise
	 */
	private sleepAnimationDelay(multiplier: number = 1): boolean|Promise<any> {
		if(this.animationDelay * multiplier == 0) {
			return true;
		}
		return new Promise(resolve => setTimeout(resolve, this.animationDelay * multiplier));
	}
}

export { TextWriter };
