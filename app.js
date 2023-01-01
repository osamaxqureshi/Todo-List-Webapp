const express = require("express");
const { request } = require("http");
const app = express();
app.use(express.urlencoded());
const https = require("https");
const date = require(__dirname + "/date.js");
const items = ["Buy Food", "Cook Food", "Eat Food"];
const workItems = [];

// for random port on server
app.use(express.static("Public"));

// for using ejs
app.set('view engine', 'ejs');

app.get("/", function (req, res) {
	let day = date.getDate();
	// to get Day of the week
	// const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	// const d = new Date();
	// let day = weekday[d.getDay()];

	//to get suggested day according to the rules
	// if (currentDay === 6 || currentDay === 0) {
	// 	day = "Weekend";
	// }
	// else {
	// 	day = "Weekday";
	// }

	res.render("list", { listTitle: day, newListItems: items })
});

app.post("/", function (req, res) {

	if (req.body.list === "Work") {
		var item = req.body.newItem;
		workItems.push(item);
		res.redirect("/work");
	}
	else {
		var item = req.body.newItem;
		items.push(item);
		res.redirect("/");
	}
});

app.get("/about", function (req, res) {
	res.render("about");
})


app.get("/work", function (req, res) {
	res.render("list", { listTitle: "Work", newListItems: workItems })
})

app.listen(process.env.PORT || 3000, function () {
	console.log("Server Has Started @ 3000 Port");
});