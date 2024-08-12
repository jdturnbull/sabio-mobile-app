import moment from 'moment';
import axios from 'axios';
import { REACT_APP_ACTIVITY_SEARCH_KEY } from '@env';

const getDescription = (assetDescriptions) => {
    if (assetDescriptions && assetDescriptions.length > 0) {
        return assetDescriptions[0].description;
    } else {
        return '';
    }
};

const getImageUrl = (assetImages) => {
    if (assetImages && assetImages.length > 0) {
        return assetImages[0].imageUrlAdr;
    } else {
        return '';
    }
};

const getType = (attributes) => {
    if (attributes.length < 1) return '';

    let type = '';

    for (let i = 0; i < attributes.length; i++) {
        let _type = attributes[0]?.attribute?.attributeValue;
        if (_type) type = _type;
    }

    return type;
};


export default getEvents = async ({ query, country }) => {
    const end_date_string = `${moment.utc().add(1, 'y').format('YYYY-MM-DD')}`;
    const date_range_string = `${moment.utc().add(2, 'w').format('YYYY-MM-DD')}..${end_date_string}`;

    let search_url = new URL('https://api.amp.active.com/v2/search?');

    if (query) search_url.searchParams.append('query', query);
    if (country) search_url.searchParams.append('near', country);
    search_url.searchParams.append('radius', 1000);
    search_url.searchParams.append('category', 'Races');
    search_url.searchParams.append('start_date', date_range_string);
    search_url.searchParams.append('api_key', REACT_APP_ACTIVITY_SEARCH_KEY);

    const response = await axios.get(search_url.toString());

    const results = response.data.results.map((result, index) => {
        return {
            id: result.assetGuid,
            name: result.assetName,
            city: result.place.cityName,
            country: result.place.countryName,
            country_code: result.place.countryCode,
            start: result.activityStartDate,
            description: getDescription(result.assetDescriptions),
            type: getType(result.assetAttributes),
            image_url: getImageUrl(result.assetImages),
        };
    });

    let uniqueResults = [];
    const seenIds = new Set();

    results.forEach((result) => {
        if (!seenIds.has(result.id)) {
            uniqueResults.push(result);
            seenIds.add(result.id);
        }
    });

    uniqueResults = uniqueResults.filter((e) => e.type !== '' && e.description !== '' && e.image_url !== '');
    return uniqueResults;
};