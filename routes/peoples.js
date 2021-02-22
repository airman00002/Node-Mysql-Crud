const express = require("express");
const router = express.Router();
const db = require("../lib/db");
const flash = require("express-flash");

//*----display----------

router.get("/", async (req, res, next) => {
  let name = req.query.name;
  if (name) {
    try {
      let result = await db.query(
        "SELECT * FROM peoples WHERE name LIKE "+db.escape('%'+name+'%'));

      if (result === undefined || result.length === 0) {
        req.flash("error", "No Database");
        res.render("index", { results: "" });
      } else {
        req.flash("success", "Get Successfully Database");
        res.render("index", { results: result });
      }
    } catch (error) {
      console.log(error.message);
    }
  } else {
    try {
      let result = await db.query("SELECT * FROM peoples ");
      if (result === undefined || result.length === 0) {
        req.flash("error", "No Database");
        res.render("index", { results: "" });
      } else {
        req.flash("success", "Get Successfully Database");
        res.render("index", { results: result });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
});

//*display add----------------------------------------------------------------
router.get("/add", (req, res, next) => {
  res.render("add",{name:'',city:''});
});

//*------------get edit-------------------------------------------
router.get("/edit/:id", async (req, res, next) => {
  let id = req.params.id;
  console.log(id);
  if (id === undefined) {
    req.flash("error", "Database No id" + id);
    res.redirect("/peoples");
  } else {
    try {
      let result = await db.query("SELECT * FROM peoples WHERE id =" + id);
      console.log(result);
      if (result === undefined || result.length === 0) {
        req.flash("error", "No Database");
        res.redirect("/peoples");
      } else {
        req.flash(
          "success",
          "Get Successfully Database By ID = " + result[0].id
        );
        res.render("edit", {
          name: result[0].name,
          city: result[0].city,
          id: result[0].id,
        });
      }
    } catch (error) {
      console.log(error.message);
    }
  }
});
//TODO-------------------------------------------------------------------------------------------

//*--------post add peoples-----------------------------------------------
router.post("/add", async (req, res, next) => {
  let name = req.body.name;
  let city = req.body.city;
  console.log(name, city);

    if(!name || !city) {
      req.flash('error','Please enter a name or city')
      res.render('add',{name:name,city:city})
    }else{
      try {
        let result = await db.query('INSERT INTO peoples (name,city) VALUES (?,?)',[name,city])  
        req.flash('success','Success! You have successfully added')
        res.redirect('/peoples')
      } 
      catch (error) {
        req.flash('error',error)
        res.render('add',{name:name,city:city})
      }

    }
  
});

//*----------post update-------------------
router.post("/update/:id", async (req, res, next) => {
  let id = req.params.id;
  let name = req.body.name;
  let city = req.body.city;
  console.log(id, name, city);

  if (!id || !name || !city) {
    req.flash("error", "Please provide id , name and city");
    res.render("edit", { id: id, name: name, city: city });
  } else {
    try {
      let result = await db.query( "UPDATE peoples SET name=?,city=? WHERE id = " + id,[name, city]);
       
      
      req.flash("success", "Successfully Updated !!");
      res.redirect("/peoples");
    } catch (error) {
      console.log(error.message);
    }
  }
});

//*-----------delete people---------------------------------
router.get("/delete/:id", async (req, res) => {
  let id = req.params.id;

  if (id === undefined) {
    req.flash("error", "Database No id" + id);
    res.redirect("/peoples");
  } else {
    try {
      let result = await db.query("DELETE FROM peoples WHERE id =" + id);
      req.flash("success", "Successfully Deleted ID= " + id);
      res.redirect("/peoples");
    } catch (error) {
      console.log(error.message);
    }
  }
});

module.exports = router;
