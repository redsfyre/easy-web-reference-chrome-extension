let contextMenuItem = {
	id: "web-referance",
	title: "Copy the web referance",
	contexts: ["selection"],
};

chrome.contextMenus.create(contextMenuItem);

chrome.contextMenus.onClicked.addListener((clickData, tab) => {
	const refLink = createRefLink(tab.url, clickData.selectionText);
	copyTextToClipboard(refLink);
	sendNotification(clickData.selectionText);
});

const copyTextToClipboard = (text) => {
	//Create a textbox field where we can insert text to.
	var copyFrom = document.createElement("textarea");

	//Set the text content to be the text you wished to copy.
	copyFrom.textContent = text;

	//Append the textbox field into the body as a child.
	//"execCommand()" only works when there exists selected text, and the text is inside
	//document.body (meaning the text is part of a valid rendered HTML element).
	document.body.appendChild(copyFrom);

	//Select all the text!
	copyFrom.select();

	//Execute command
	document.execCommand("copy");

	//(Optional) De-select the text using blur().
	copyFrom.blur();

	//Remove the textbox field from the document.body, so no other JavaScript nor
	//other elements can get access to this.
	document.body.removeChild(copyFrom);
};

const createRefLink = (url, mention) => {
	// console.log("SELECTED WORD:", mention);
	// console.log("REF URL:", url);
	const regex = /^.*(?=(\#:~:text))/gim;
	url = url.match(regex) ? url.match(regex)[0] : url;
	const refLink = `${url}#:~:text=${mention}`;
	return refLink.split(" ").join("%20");
};

const sendNotification = (mention) => {
	chrome.notifications.create({
		title: "The referenced URL copied your clipboard!",
		message: `You mentioned this section: "${mention}"`,
		iconUrl: "/src/assets/images/web-ref.png",
		type: "basic",
	});
};

