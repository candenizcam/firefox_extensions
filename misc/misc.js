const natural = require('natural');
const tokenizer = new natural.WordTokenizer();



function extractKeywords(text) {
    const tokens = tokenizer.tokenize(text);
    const frequency = {};

    tokens.forEach(token => {
        token = token.toLowerCase();

        if (!natural.stopwords.words.includes(token)) {
            frequency[token] = (frequency[token] || 0) + 1;
        }
    });

    const sortedKeywords = Object.keys(frequency).sort((a, b) => frequency[b] - frequency[a]);
    return sortedKeywords.slice(0, 5); // Adjust the number of keywords to extract as needed
}

const text = "Your text goes here. Replace this with the text you want to analyze for keywords.";
//const keywords = extractKeywords(text);
console.log(tokenizer.tokenize(text));