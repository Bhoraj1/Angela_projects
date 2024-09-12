//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/todolistDB");

//mongoose Schema  
const itemsSchema = {
  name: String
};
//mongoose model
const Item = mongoose.model("Item", itemsSchema);

//mongoose document
const item1 = new Item({
  name: "welcome1"
});

const item2 = new Item({
  name: "welcome2"
});

const item3 = new Item({
  name: "welcome3"
});

//Document Array
const defaultItems = [item1, item2, item3];

//Schema for Custom Route Name
// const listSchema ={
//   name: String,
//   items:[itemsSchema]
// };

//mongoose model of custome route name schema
// const List = mongoose.model("List",listSchema);


app.get("/", function(req, res) {

  Item.find({}).then(function(foundItems){

    if (foundItems.length===0){
      Item.insertMany(defaultItems).then(function(){
        console.log("inserted successfully");
    })
    .catch(function(err){
        console.log(err);
    
    });
    res.redirect("/");
  }else{
    res.render("list", {listTitle: "Today", newListItems: foundItems});
  }
  })
  .catch(function(err){
     console.log(err);
  })

});
//This route is responsible for custom route
app.get("/:customeListName",function(req, res){
 console.log(req.params.customeListName);
});

//This route is responsible for Adding a new item to the list.
app.post("/", function(req, res){

  const itemName = req.body.newItem;

  const item = new Item({
    name: itemName
  });

  item.save();
  res.redirect("/");
});

//This route is responsible for deleteing the item .
app.post("/delete",function(req,res){
  const CheckedItemId = (req.body.checkbox);
  Item.findByIdAndDelete(CheckedItemId).then (function(){
    console.log("item deleted successfully");
  })
  .catch(function(err){
    console.log(err);
    
});
res.redirect("/");

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
