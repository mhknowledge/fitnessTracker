const router = require("express").Router();
const db = require("../models");

router.get("/api/workouts", (req, res) => {
  db.Workout.aggregate([{
    $addFields: {
      totalDuration: { $sum: "$exercises.duration" }
    }
  }])
  .sort({ day: 1 })
  .then(dbWorkouts => {
    res.json(dbWorkouts);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// Update current workout
router.put("/api/workouts/:id", (req, res) => {
  db.Workout.findOneAndUpdate(
    { _id:req.params.id }, 
    { $push: { exercises:req.body } }
  )
  .then(dbWorkout => {
    res.json(dbWorkout);
  })
  .catch(err => {
    res.status(400).json(err);
  });
});

// Create a new workout
router.post("/api/workouts", ({ body }, res) => {
  db.Workout.create(body)
  .then(dbWorkout => {
    res.json(dbWorkout);
  })  
  .catch(err => {
    res.status(400).json(err);
  });  
});  

// Get workouts within a range
router.get("/api/workouts/range", (req, res) => {
  db.Workout.find({})
  .then(dbWorkouts => {
    res.json(dbWorkouts);
  })    
  .catch(err => {
    res.status(400).json(err);
  });    
});    

router.delete('/api/workouts', ({ body }, res) => {
  db.Workout.findByIdAndDelete(body.id)
    .then(() => {
      res.json(true);
    })
    .catch((err) => {
      res.json(err);
    });
});

module.exports = router;
