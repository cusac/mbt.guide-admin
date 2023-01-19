import vm from '../main';
import store from '../store';
import { httpClient as http } from '../services';

const internals = {};

internals.getMatchingTags = function(tagText, maxMatches) {
    
    const svcPath = 'http://localhost:8080/tagmatch';
    var maxmatches;

    if(maxMatches && maxMatches > 0)
        maxmatches = maxMatches;
    else
        maxmatches = 10;

    const payload = {
        'tagtext': tagText,
        'maxmatches': maxmatches
    }

    return http.get(svcPath, payload);

};

export default internals;
