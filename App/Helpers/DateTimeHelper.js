//moment(testDate).format('MM/DD/YYYY');
//var a = moment().toISOString(true);

//dt.toISO(); //=> '2017-04-20T11:32:00.000-04:00'
//dt.toISODate(); //=> '2017-04-20'
//dt.toISOWeekDate(); //=> '2017-W17-7'
//dt.toISOTime(); //=> '11:32:00.000-04:00'

//var d = DateTime.fromISO('2014-08-06T13:07:04.054').setLocale('ru');
//d.toFormat('LLLL'); //=> 'август' (standalone)
//d.toFormat('MMMM'); //=> 'августа' (format)

//var date = moment(new Date(), moment.ISO_8601);
//console.log(date);

//moment('05-17-2018 11:40 PM', 'MM-DD-YYYY hh:mm A')
//moment("12-25-1995", "MM-DD-YYYY");
//moment('24/12/2019 09:15:00', "DD MM YYYY hh:mm:ss", true);
//moment("2010 11 31",        "YYYY MM DD").isValid();
//moment('2012-05-25',       'YYYY-MM-DD', true).isValid(); 
//moment("123", "hmm").format("HH:mm") === "01:23"

//moment("29-06-1995", ["MM-DD-YYYY", "DD-MM", "DD-MM-YYYY"]); // uses the last format
//moment("05-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"]);          // uses the first format

//moment("29-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], 'fr');       // uses 'fr' locale
//moment("29-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], true);       // uses strict parsing
//moment("05-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], 'fr', true); // uses 'fr' locale and strict parsing

//[year, month, day, hour, minute, second, millisecond]

//moment([2010, 10, 31]).isValid(); // false (not a real day)

//moment().get('year');
//moment().get('month');  // 0 to 11
//moment().get('date');
//moment().get('hour');
//moment().get('minute');
//moment().get('second');
//moment().get('millisecond');

//moment().set('year', 2013);
//moment().set('month', 3);  // April
//moment().set('date', 1);
//moment().set('hour', 13);
//moment().set('minute', 20);
//moment().set('second', 30);
//moment().set('millisecond', 123);
//moment().set({'year': 2013, 'month': 3});

//var a = moment().subtract(1, 'day');
//var b = moment().add(1, 'day');
//moment.max(a, b);  // b

//const dateA = moment('01-01-1900', 'DD-MM-YYYY');
//const dateB = moment('01-01-2000', 'DD-MM-YYYY');
//console.log(dateA.from(dateB));

//moment('2020.01.01', 'YYYY.MM.DD').fromNow(true);

//const dateB = moment('2014-11-11');
//const dateC = moment('2014-10-11');
//console.log('Difference is ', dateB.diff(dateC), 'milliseconds');
//console.log('Difference is ', dateB.diff(dateC, 'days'), 'days');
//console.log('Difference is ', dateB.diff(dateC, 'months'), 'months');

//console.log(moment('2020-01-01').isAfter('2019-01-01')); // true
//console.log(moment('2020-01-01').isAfter('2020-01-08')); // false

//const today = moment();
//const nextWeek = today.clone().add(7, 'days');
//console.log(today.fromNow());

//const m1 = moment({ y: 2017, M: 0, d: 4, h: 15, m: 10, s: 3, ms: 123}); 
//const m2 = moment({ year:2017, month: 0, day: 4, hour: 15, minute: 10, second: 3, millisecond: 123});

//const myDate = moment(str, 'YYYY-MM-DD').toDate();
//const myDate = moment(str, 'YYYY-MM-DD').toDate();

//moment.defaultFormat = "DD.MM.YYYY HH:mm";
// parse with .toDate()
//moment('20.07.2018 09:19').toDate() // Invalid date
// format the date string with the new defaultFormat then parse
//moment('20.07.2018 09:19', moment.defaultFormat).toDate() // Fri Jul 20 2018 09:19:00 GMT+0300


//moment().toArray(); // [2013, 1, 4, 14, 40, 16, 154];
//moment().toArray(); // [2013, 1, 4, 14, 40, 16, 154];

//moment().toISOString();
//moment().toISOString(keepOffset); // from 2.20.0

//moment().toObject()  // {
                     //     years: 2015
                     //     months: 6
                     //     date: 26,
                     //     hours: 1,
                     //     minutes: 53,
                     //     seconds: 14,
                     //     milliseconds: 600
                     // }

//moment().inspect() // 'moment("2016-11-09T22:23:27.861")'



//moment("2010-01-01T05:06:07", moment.ISO_8601);
//moment("2010-01-01T05:06:07", ["YYYY", moment.ISO_8601]);


//moment("29-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], 'fr');       // uses 'fr' locale
//moment("29-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], true);       // uses strict parsing
//moment("05-06-1995", ["MM-DD-YYYY", "DD-MM-YYYY"], 'fr', true); // uses 'fr' locale and strict parsing