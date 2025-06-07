const express = require('express');
const Gym = require('../models/gym');
const dummyGyms = require('../data/dummydata');

const router = express.Router();

// Get all gyms
router.get('/', async (req, res) => {
  try {
    // First, check if we have gyms in the database
    let gyms = await Gym.find();
    
    // If no gyms in database, seed with dummy data
    if (gyms.length === 0) {
      console.log('No gyms found in database, seeding with dummy data...');
      await Gym.insertMany(dummyGyms);
      gyms = await Gym.find();
      console.log(`Seeded ${gyms.length} gyms to database`);
    }
    
    res.json(gyms);
  } catch (err) {
    console.error('Error fetching gyms:', err);
    
    // Fallback to dummy data if database fails
    console.log('Database error, returning dummy data...');
    res.json(dummyGyms);
  }
});

// Get single gym by ID
router.get('/:id', async (req, res) => {
  try {
    const gym = await Gym.findById(req.params.id);
    
    if (!gym) {
      return res.status(404).json({ message: 'Gym not found' });
    }
    
    res.json(gym);
  } catch (err) {
    console.error('Error fetching gym:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Add new gym (for future use)
router.post('/', async (req, res) => {
  try {
    const { name, rating, location, description, image } = req.body;
    
    const newGym = new Gym({
      name,
      rating,
      location,
      description,
      image
    });
    
    const savedGym = await newGym.save();
    res.status(201).json(savedGym);
  } catch (err) {
    console.error('Error creating gym:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;