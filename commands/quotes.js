const QuotesAPI = require('quote-indo');

exports.module = async (message) => {
    const query = 'random';
    const quote = QuotesAPI.Quotes(query);
    if(quote.length > 0){
        return quote;
    }else{
        return 'tidak ada quotes untukmu';
    }
}