export default {
    timeFilter: function(value) {
        return value ? 
            new Date(value).toLocaleTimeString(
                'es-MX', { 
                    timeZone: 'America/Mexico_City'
                }) : '—';
    },
    dateFilter: function(value) {
        return value ? 
            new Date(value).toLocaleDateString(
                'es-MX', { 
                    timeZone: 'America/Mexico_City'
                }) : '—';
    },
    dateTimeFilter(value, prefix = '', suffix = '') {
        const repr = value ? 
            new Date(value).toLocaleString(
                'es-MX', { 
                    timeZone: 'America/Mexico_City' 
                }) : '—';
        return prefix + repr + suffix;
    },

    timeElapsedFilter(date) {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        var dt = Math.floor(seconds / 31536000);

        if (dt >= 1) {
            return dt + ' ' + (dt === 1 ? 'año' : 'años');
        }
        dt = Math.floor(seconds / 2592000);
        if (dt > 1) {
            return dt + ' ' + (dt === 1 ? 'mes' : 'meses');
        }
        dt = Math.floor(seconds / 86400);
        if (dt > 1) {
            return dt + ' ' + (dt === 1 ? 'día' : 'días');
        }
        dt = Math.floor(seconds / 3600);
        if (dt > 1) {
            return dt + ' ' + (dt === 1 ? 'hora' : 'horas');
        }
        dt = Math.floor(seconds / 60);
        if (dt > 1) {
            return dt + ' ' + (dt === 1 ? 'minuto' : 'minutos');
        }
        dt = Math.floor(seconds);
        return dt + ' ' + (dt === 1 ? 'segundo' : 'segundos');
    },

    isoDateFilter(date) {
        date = new Date(date);
        let month = '' + (date.getMonth() + 1);
        let day = '' + date.getDate();
        const year = date.getFullYear();
        if (month.length < 2) {
            month = '0' + month;
        }
        if (day.length < 2) {
            day = '0' + day;
        }
        return [year, month, day].join('-');
    },

    ageFilter(value) {
        return value ? (value + ' años') : 'Desconocida';
    },

    bigNumberFilter(num, digits = 2, prefix = '', sufix = '') {
        var si = [
            { value: 1, symbol: '' },
            { value: 1E3, symbol: 'K' },
            { value: 1E6, symbol: 'M' },
            { value: 1E9, symbol: 'G' },
            { value: 1E12, symbol: 'T' },
            { value: 1E15, symbol: 'P' },
            { value: 1E18, symbol: 'E' }
        ];
        var rx = /\.0+$|(\.[0-9]*[1-9])0+$/;
        var i;
        for (i = si.length - 1; i > 0; i--) {
            if (num >= si[i].value) {
                break;
            }
        }
        const repr = (num / si[i].value).toFixed(digits).replace(rx, '$1');
        return prefix + repr + si[i].symbol + sufix;
    },

    percentFilter(value) {
        return (100 * value).toFixed(0) + '%';
    },

    timeDurationFilter(seconds) {
        return new Date(1000 * seconds).toISOString().substr(11, 8);
    },

    boldQueryText(text, query) {
        const re = new RegExp(query, 'g');
        return text.replace(re, '<b>' + query + '</b>');
    }
};
