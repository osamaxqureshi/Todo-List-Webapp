const express = require("express");
const { request } = require("http");
const app = express();
app.use(express.urlencoded());
const https = require("https");

// for random port on server
app.use(express.static("Public"));

// for using ejs
app.set('view engine', 'ejs');

app.get("/", function (req, res) {

	var today = new Date();
	var currentDay = today.getDate();

	// to get Day of the week
	const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	const d = new Date();
	let day = weekday[d.getDay()];

	//to get suggested day according to the rules
	// if (currentDay === 6 || currentDay === 0) {
	// 	day = "Weekend";
	// }
	// else {
	// 	day = "Weekday";
	// }

	res.render("list", { kindofDay: day })
});

app.listen(process.env.PORT || 3000, function () {
	console.log("Server Has Started @ 3000 Port");
});