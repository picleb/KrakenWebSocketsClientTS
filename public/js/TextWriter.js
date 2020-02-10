class TextWriter {
    constructor(destinationId) {
        this.textDestinationContainer = undefined;
        this.animationDelay = 50;
        this.htmlWrapperTag = 'p';
        this.setDestination(destinationId);
    }
    setDestination(destinationId) {
        this.textDestinationContainer = document.getElementById(destinationId);
        console.log(`TextWriter destination is set to ${destinationId}`);
    }
    getTargetElement() {
        let targetElement = this.textDestinationContainer;
        if (this.htmlWrapperTag) {
            this.textDestinationContainer.insertAdjacentHTML('beforeend', `<${this.htmlWrapperTag}></${this.htmlWrapperTag}>`);
            targetElement = document.querySelector('#' + this.textDestinationContainer.id + ` ${this.htmlWrapperTag}:last-of-type`);
        }
        return targetElement;
    }
    async writeJson(text, animationMultiplier = 0.4) {
        if (typeof text == 'string')
            text = JSON.parse(text);
        text = JSON.stringify(text, null, 2);
        this.textDestinationContainer.insertAdjacentHTML('beforeend', '<pre></pre>');
        let targetElement = this.textDestinationContainer.querySelector('pre:last-of-type');
        for (let i = 0; i < text.length; i++) {
            await this.sleepAnimationDelay(animationMultiplier);
            this.writeChar(text.charAt(i), targetElement);
        }
    }
    async write(text, animationMultiplier = 1) {
        let targetElement;
        if (typeof text == 'object') {
            for (var x in text) {
                await this.write(text[x], animationMultiplier);
            }
        }
        else {
            targetElement = this.getTargetElement();
            for (let i = 0; i < text.length; i++) {
                await this.sleepAnimationDelay(animationMultiplier);
                this.writeHtmlChar(text.charAt(i), targetElement);
            }
        }
    }
    async skipAnimation() {
        let delay = this.animationDelay;
        this.animationDelay = 0;
        await new Promise(r => setTimeout(r, delay));
        this.animationDelay = delay;
    }
    writeHtmlChar(char, target) {
        target.insertAdjacentHTML('beforeend', `<span>${char}</span>`);
        this.scrollDown();
    }
    writeChar(char, target) {
        target.insertAdjacentText('beforeend', `${char}`);
        this.scrollDown();
    }
    scrollDown() {
        this.textDestinationContainer.parentElement.scrollTop = this.textDestinationContainer.parentElement.scrollHeight;
    }
    sleepAnimationDelay(multiplier = 1) {
        if (this.animationDelay * multiplier == 0) {
            return true;
        }
        return new Promise(resolve => setTimeout(resolve, this.animationDelay * multiplier));
    }
}
export { TextWriter };
