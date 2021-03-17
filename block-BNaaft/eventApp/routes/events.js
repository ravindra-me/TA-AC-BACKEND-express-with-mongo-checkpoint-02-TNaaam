var express = require("express");
const { get } = require("mongoose");
var router = express.Router();
var Events = require("../models/Events");
var Remark = require("../models/Remark");
var Moment = require("moment");
var public = require("../public");

/* GET users listing. */
router.get("/", function (req, res, next) {
  Events.find({}, (err, content) => {
    if (err) return next(err);
    console.log(content.start_date);
    content.start_date = Moment(content.start_date).format("l");
    console.log(content.start_date);
    Events.distinct("category", (err, category) => {
      if (err) return next(err);
      res.render("events", {
        data: content,
        categoryes: category,
        public: public,
      });
    });
  });
});

router.get("/home", (req, res) => {
  res.render("home");
});

router.get("/about", (req, res) => {
  res.render("about");
});

// new events
router.get("/new", (req, res) => {
  res.render("addEvent");
});

// add  event
router.post("/", (req, res, next) => {
  req.body.category = req.body.category.split(" ");
  req.body.start_date = Moment(req.body.start_date).format("l");
  req.body.location = public.lowercase(req.body.location);
  Events.create(req.body, (err, content) => {
    if (err) return next(err);
    res.redirect("/events");
  });
});

// router.get("/:id", (req, res, next) => {
//   Events.findById(req.params.id, (err, content)=>{
//     if(err) return next(err)
//     res.render("details", { data: content });
//   })
// });

router.get("/sortdate", (req, res, next) => {
  console.log("string 2");
  Events.find({})
    .sort({ start_date: 1 })
    .exec((err, content) => {
      if (err) return next(err);
      Events.distinct("category", (err, category) => {
        if (err) return next(err);
        res.render("events", {
          data: content,
          categoryes: category,
        });
      });
      console.log(content);
    });
});

router.post("/location", (req, res) => {
  var loc = public.lowercase(req.body.location);
  Events.find({ location: loc }, (err, content) => {
    if (err) return next(err);
    Events.distinct("category", (err, category) => {
      if (err) return next(err);
      res.render("events", {
        data: content,
        categoryes: category,
        public:public
      });
    });
  });
});

router.get("/:id", (req, res, next) => {
  console.log("string 1");
  Events.findById(req.params.id)
    .populate("remarks")
    .exec((err, content) => {
      if (err) return next(err);
      res.render("details", { data: content, public: public });
    });
});

// filter the list based on category
router.get("/:elem/category", (req, res, next) => {
  var elem = req.params.elem;
  Events.find({ category: { $in: [elem] } }, (err, content) => {
    if (err) return next(err);
    Events.distinct("category", (err, category) => {
      if (err) return next(err);
      res.render("events", {
        data: content,
        categoryes: category,
      });
    });
  });
});

// likes

router.get("/:id/like", (req, res, next) => {
  Events.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    (err, content) => {
      if (err) return next(err);
      res.redirect("/events/" + req.params.id);
    }
  );
});

// edit event

router.get("/:id/edit", (req, res, next) => {
  Events.findById(req.params.id, (err, content) => {
    if (err) return next(err);
    content.category = content.category.join(" ");
    res.render("editEvent", { data: content });
  });
});

router.post("/:id/edit", (req, res) => {
  req.body.category = req.body.category.split(" ");
  Events.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, content) => {
      if (err) return next(err);
      res.redirect("/events/" + req.params.id);
    }
  );
});

// delete the event
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Events.findByIdAndDelete(id, (err, content) => {
    if (err) return next(err);
    Remark.deleteMany({ eventId: content._id }, (err, updateEvent) => {
      if (err) return next(err);
      res.redirect("/events");
    });
  });
});

// comments

router.post("/:id/comments", (req, res, next) => {
  req.body.eventId = req.params.id;
  Remark.create(req.body, (err, content) => {
    if (err) return next(err);
    Events.findByIdAndUpdate(
      req.params.id,
      { $push: { remarks: content._id } },
      (err, updateContent) => {
        if (err) return next(err);
        res.redirect("/events/" + req.params.id);
      }
    );
  });
});

module.exports = router;
