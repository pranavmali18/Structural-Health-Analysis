import Structure from '../models/Structure.js';

// Pre-seeded initial structures for academic prototype demonstration
const INITIAL_STRUCTURES = [
  {
    structureId: 'str-001',
    name: 'Starlight Skybridge',
    type: 'Bridge',
    location: 'Sector 7 Cable Bridge, East Bay',
    constructionYear: 2012,
    material: 'Prestressed Concrete & Steel Trusses',
    length: 450,
    width: 28,
    height: 65,
    status: 'Warning',
    riskScore: 42,
    description: 'Multi-span cable-stayed highway bridge with high daily traffic load.'
  },
  {
    structureId: 'str-002',
    name: 'Horizon Central Tower',
    type: 'Building',
    location: '405 Tech District Plaza',
    constructionYear: 2018,
    material: 'Reinforced Concrete Core & Glass Facade',
    length: 80,
    width: 60,
    height: 220,
    status: 'Healthy',
    riskScore: 12,
    description: 'High-rise 54-story commercial office building equipped with tuned mass dampers.'
  },
  {
    structureId: 'str-003',
    name: 'Apex Hydroelectric Dam',
    type: 'Dam',
    location: 'River Basin North Segment',
    constructionYear: 1998,
    material: 'Mass Arch Concrete',
    length: 320,
    width: 45,
    height: 110,
    status: 'High Risk',
    riskScore: 68,
    description: 'Arch gravity dam subjected to hydrostatic pressure and seasonal thermal cycles.'
  },
  {
    structureId: 'str-004',
    name: 'Metropolis Comm TV Tower',
    type: 'Tower',
    location: 'Peak Hill Elevation 850m',
    constructionYear: 2005,
    material: 'Lattice Structural Steel',
    length: 30,
    width: 30,
    height: 180,
    status: 'Critical',
    riskScore: 84,
    description: 'Telecommunications guyed lattice tower exposed to extreme wind gusts.'
  }
];

// @desc Get all structures
// @route GET /api/structures
export const getStructures = async (req, res, next) => {
  try {
    let structures = await Structure.find().sort({ createdAt: -1 });

    if (structures.length === 0) {
      // Seed database with default academic structures if empty
      structures = await Structure.insertMany(INITIAL_STRUCTURES);
    }

    res.json({
      success: true,
      count: structures.length,
      data: structures
    });
  } catch (error) {
    // Return seeded mock array if DB connection is offline
    res.json({
      success: true,
      count: INITIAL_STRUCTURES.length,
      data: INITIAL_STRUCTURES
    });
  }
};

// @desc Get single structure
// @route GET /api/structures/:id
export const getStructureById = async (req, res, next) => {
  try {
    const structure = await Structure.findOne({
      $or: [{ _id: req.params.id }, { structureId: req.params.id }]
    });

    if (!structure) {
      const foundMock = INITIAL_STRUCTURES.find(s => s.structureId === req.params.id);
      if (foundMock) return res.json({ success: true, data: foundMock });
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    res.json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

// @desc Create new structure
// @route POST /api/structures
export const createStructure = async (req, res, next) => {
  try {
    const { name, type, location, constructionYear, material, length, width, height, description } = req.body;

    const structureId = `str-${Date.now().toString().slice(-4)}`;

    const structure = await Structure.create({
      structureId,
      name,
      type,
      location,
      constructionYear,
      material,
      length: length || 50,
      width: width || 30,
      height: height || 20,
      description,
      status: 'Healthy',
      riskScore: 15
    });

    res.status(201).json({
      success: true,
      data: structure
    });
  } catch (error) {
    next(error);
  }
};

// @desc Update structure
// @route PUT /api/structures/:id
export const updateStructure = async (req, res, next) => {
  try {
    const structure = await Structure.findOneAndUpdate(
      { $or: [{ _id: req.params.id }, { structureId: req.params.id }] },
      req.body,
      { new: true, runValidators: true }
    );

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    res.json({ success: true, data: structure });
  } catch (error) {
    next(error);
  }
};

// @desc Delete structure
// @route DELETE /api/structures/:id
export const deleteStructure = async (req, res, next) => {
  try {
    const structure = await Structure.findOneAndDelete({
      $or: [{ _id: req.params.id }, { structureId: req.params.id }]
    });

    if (!structure) {
      return res.status(404).json({ success: false, message: 'Structure not found' });
    }

    res.json({ success: true, message: 'Structure deleted successfully' });
  } catch (error) {
    next(error);
  }
};
