const express = require("express");
const { request } = require("http");
const app = express();
app.use(express.urlencoded());
const https = require("https");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const _ = require("lodash");

/** Connect to mongoose server */
mongoose.connect("mongodb+srv://osamaxqureshi:OJRxTm0r4jFRpmVg@cluster0.0to2gd9.mongodb.net/todolistDB", {
  useNewUrlParser: true,
});

/** Schema MongoDB */
const itemsSchema = new mongoose.Schema({
  name: String,
});

const listSchema = new mongoose.Schema({
  name: String,
  items: [itemsSchema],
});

/** Model Mongoose */
const Item = mongoose.model("Item", itemsSchema);

const List = mongoose.model("List", listSchema);

/** no longer use with Mongoose */

// const items = ["Buy Food", "Cook Food", "Eat Food"];
// const workItems = [];

const item1 = new Item({
  name: "Welcome to your todolist!",
});

const item2 = new Item({
  name: "Hit the + button to add a new item.",
});

const item3 = new Item({
  name: "<-- Hit this to delete an item.",
});

const defaultItems = [item1, item2, item3];

// for random port on server
app.use(express.static("Public"));

// for using ejs
app.set("view engine", "ejs");

app.get("/", function (req, res) {
  let day = "Today";
  // let day = date.getDate();
  /** to get Day of the week */
  // const weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  // const d = new Date();
  // let day = weekday[d.getDay()];

  /** to get suggested day according to the rules */
  // if (currentDay === 6 || currentDay === 0) {
  // 	day = "Weekend";
  // }
  // else {
  // 	day = "Weekday";
  // }

  //** moved res.render to Item.find() Mongoose */
  // res.render("list", { listTitle: day, newListItems: items })

  Item.find({})
    .then(function (foundItems) {
      if (foundItems.length === 0) {
        /** Insert Items 1,2 & 3 to todolistDB */
        Item.insertMany(defaultItems)
          .then(function (result) {
            console.log("Sucessfully Added Default Items to DB.");
          })
          .catch(function (err) {
            console.log(err);
          });
        res.redirect("/");
      } else res.render("list", { listTitle: day, newListItems: foundItems });
    })
    .catch(function (err) {
      console.log(err);
    });
});

// app.post("/", function (req, res) {
//   //** Used before Mongoose */
//   //   if (req.body.list === "Work") {
//   //     var item = req.body.newItem;
//   //     workItems.push(item);
//   //     res.redirect("/work");
//   //   } else {
//   //     var item = req.body.newItem;
//   //     items.push(item);

//   const itemName = req.body.newItem;
//   const item = new Item({
//     name: itemName,
//   });
//   item.save();
//   res.redirect("/");
// });

app.post("/", function (req, res) {
  const itemName = req.body.newItem;
  const listName = req.body.list;
  const item = new Item({
    name: itemName,
  });
  if (listName === "Today") {
    item.save();
    res.redirect("/");
  } else {
    List.findOne({ name: listName }).then(function (foundList) {
      foundList.items.push(item);
      foundList.save();
      res.redirect("/" + listName);
    });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

app.post("/delete", function (req, res) {
  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === "Today") {
    Item.findByIdAndRemove(checkedItemId)
      .then(function (result) {
        console.log("Sucessfully Deleted Checked Item.");
      })
      .catch(function (err) {
        console.log(err);
      });
    res.redirect("/");
  } else {
    List.findOneAndUpdate({name: listName}, {$pull: {items: {_id: checkedItemId}}}).then(function(foundList){
      res.redirect("/" + listName)
    })
  }
});

app.get("/:customListName", function (req, res) {
  const customListName = _.capitalize(req.params.customListName);

  // List.find({})
  //   .then(function (foundList) {
  //     if (foundList.length === 0) {
  // const list = new List({
  //   name:customListName,
  //   items: defaultItems
  // });
  //  list.save();
  //  res.redirect("/" + customListName);
  //       }}); else {
  //         res.render("list",{listTitle: foundList.name, newListItems: foundList.items});
  //       }
  //       .catch(function (err) {
  //         console.log(err);
  //       });

  List.findOne({ name: customListName })
    .then(function (foundList) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: defaultItems,
        });
        list.save();
        console.log("Sucessfully Added customListName.");
        res.redirect("/" + customListName).catch(function (err) {
          console.log(err);
        });
      } else {
        res.render("list", {
          listTitle: foundList.name,
          newListItems: foundList.items,
        });
      }
    })
    .catch(function (err) {
      console.log(err);
    });
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work", newListItems: workItems });
// });

app.listen(process.env.PORT || 3000, function () {
  console.log("Server Has Started @ 3000 Port");
});
