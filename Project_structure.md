## FrontEnd (pilotnet-fe)
```
pilotnet-fe/
├── app/
│   ├── components/                 # Shared React components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── design/                    # Design page
│   │   └── page.tsx
│   ├── data/                      # Data visualization page
│   │   └── page.tsx
│   ├── about/                     # About page
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── public/                        # Static assets
├── styles/                        # Global styles and themes
├── types/                         # TypeScript type definitions
├── package.json
├── tsconfig.json
└── tailwind.config.js

## Backend (Pilotnet)
```
Pilotnet/
├── api/                          # FastAPI application
│   ├── main.py                   # Main FastAPI entry point
│   ├── routers/                  # API route handlers
│   │   ├── design.py
│   │   └── data.py
│   ├── models/                   # Data models and schemas
│   │   └── config.py
│   └── utils/                    # API utilities
│       ├── file_operations.py
│       └── model_operations.py
├── modules/                      # Core ML modules
│   ├── ObjectDetector/
│   │   ├── object_detector.py
│   │   └── utils.py
│   ├── ObjectRelationGraphDetector/
│   │   └── object_relation_graph.py
│   ├── ObjectSpatialFeatureExtractor/
│   │   └── object_spatial_feature_extractor.py
│   └── speed_modules.py
├── pilotnet/                     # Core PilotNet implementation
│   ├── dataloader/
│   │   └── data_loader.py
│   ├── models/
│   │   └── pilotnet.py
│   ├── utils/
│   │   └── utils.py
│   ├── init.py
│   ├── evaluate.py
│   └── train.py
├── data/                         # Data storage
│   ├── datasets/                 # Training datasets
│   ├── videos/                   # Video files
│   └── checkpoints/              # Model checkpoints
├── configs/                      # Configuration files
│   ├── train_config.yaml
│   └── demo_config.yaml
├── tests/                        # Unit tests
│   ├── test_api/
│   ├── test_models/
│   └── test_utils/
├── docs/                         # Documentation
│   ├── api/
│   ├── models/
│   └── setup.md
├── scripts/                      # Utility scripts
│   ├── setup.sh
│   └── train.sh
├── requirements.txt
└── README.md
```
## Key Changes and Improvements:

1. **Frontend Organization**:
   - Added dedicated `components` directory for shared React components
   - Created `styles` directory for global styling
   - Added `types` directory for TypeScript definitions

2. **Backend Restructuring**:
   - Moved ML modules to dedicated `modules` directory
   - Organized related modules into their own packages
   - Added proper separation between API and core functionality

3. **New Directories**:
   - Added `tests` directory for unit tests
   - Added `docs` directory for documentation
   - Added `scripts` directory for utility scripts
   - Created proper data organization under `data`

4. **Configuration Management**:
   - Centralized configuration files in `configs`
   - Separated training and demo configurations

5. **Documentation**:
   - Added documentation structure
   - Included setup instructions
   - Added API documentation directory

## Development Guidelines:

1. **Module Independence**: Each module should be self-contained with clear interfaces.
2. **Configuration**: Use YAML files for configuration, stored in `configs/`.
3. **Testing**: Add unit tests for new functionality in `tests/`.
4. **Documentation**: Update relevant documentation in `docs/`.
5. **Data Management**: Store all data files in appropriate subdirectories under `data/`.

## Next Steps:

1. Implement missing test directories
2. Add comprehensive documentation
3. Create setup scripts
4. Add type hints throughout the Python codebase
5. Implement proper logging
6. Add CI/CD configuration