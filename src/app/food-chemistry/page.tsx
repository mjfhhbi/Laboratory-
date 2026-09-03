import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Atom, 
  FlaskConical, 
  PieChart, 
  Calculator, 
  BookOpen, 
  ShieldCheck, 
  CheckCircle2, 
  Sparkles,
  Layers,
  Play
} from 'lucide-react';
import { FoodChemistryHeader } from '../../components/food-chemistry/FoodChemistryHeader';
import { MajorComponentsViewer } from '../../components/food-chemistry/MajorComponentsViewer';
import { ChemicalTestBank } from '../../components/food-chemistry/ChemicalTestBank';
import { ChemicalTestDetailModal } from '../../components/food-chemistry/ChemicalTestDetailModal';
import { LiveChemicalCalculator } from '../../components/food-chemistry/LiveChemicalCalculator';
import { StandardsComparisonGuide } from '../../components/food-chemistry/StandardsComparisonGuide';
import { ALL_FOOD_CHEMISTRY_TESTS } from '../../data/foodChemistryData';
import { FoodChemistryTest } from '../../types/foodChemistry';

export const FoodChemistryPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'tests' | 'components' | 'calculator' | 'standards'>('tests');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSector, setSelectedSector] = useState('all');
  const [selectedTestModal, setSelectedTestModal] = useState<FoodChemistryTest | null>(null);

  // Sector filtering for tests
  const sectorFilteredTests = ALL_FOOD_CHEMISTRY_TESTS.filter((t) => {
    if (selectedSector === 'all') return true;
    return t.sectorCompatibility.includes(selectedSector as any);
  });

  const handleLaunchInLabEngine = (test: FoodChemistryTest) => {
    // Navigate to laboratory or experiments page with test context
    navigate(`/experiments?action=new&source=food_chem&testId=${test.id}&title=${encodeURIComponent(test.titleFa)}`);
  };

  return (
    <div id="food-chemistry-main-page" className="space-y-6 pb-12">
      {/* Top Header & Search Bar */}
      <FoodChemistryHeader
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        totalTestsCount={ALL_FOOD_CHEMISTRY_TESTS.length}
      />

      {/* Main Tab Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* TAB 1: CHEMICAL TESTS BANK */}
        {activeTab === 'tests' && (
          <ChemicalTestBank
            tests={sectorFilteredTests}
            searchTerm={searchTerm}
            selectedCategory={selectedCategory}
            onCategoryChange={setSelectedCategory}
            onSelectTest={(test) => setSelectedTestModal(test)}
            onLaunchInLabEngine={handleLaunchInLabEngine}
          />
        )}

        {/* TAB 2: MAJOR FOOD COMPONENTS (PROXIMATE PROFILE) */}
        {activeTab === 'components' && (
          <MajorComponentsViewer
            onSelectComponentForTest={(compId) => {
              // Switch to tests filtered by this component
              if (compId === 'comp-moisture') setSelectedCategory('proximate_moisture');
              else if (compId === 'comp-ash') setSelectedCategory('proximate_ash');
              else if (compId === 'comp-protein') setSelectedCategory('proximate_protein');
              else if (compId === 'comp-fat') setSelectedCategory('proximate_fat');
              else if (compId === 'comp-fiber') setSelectedCategory('proximate_fiber');
              else if (compId === 'comp-carbohydrates') setSelectedCategory('carbohydrates_sugars');
              setActiveTab('tests');
            }}
          />
        )}

        {/* TAB 3: LIVE CHEMICAL CALCULATOR ENGINE */}
        {activeTab === 'calculator' && (
          <LiveChemicalCalculator
            tests={ALL_FOOD_CHEMISTRY_TESTS}
            onSelectTest={(test) => setSelectedTestModal(test)}
          />
        )}

        {/* TAB 4: STANDARDS COMPARISON & PARALLEL METHODS GUIDE */}
        {activeTab === 'standards' && (
          <StandardsComparisonGuide
            onSelectTest={(test) => setSelectedTestModal(test)}
          />
        )}
      </div>

      {/* Deep-Dive SOP & Standard Detail Modal */}
      {selectedTestModal && (
        <ChemicalTestDetailModal
          test={selectedTestModal}
          onClose={() => setSelectedTestModal(null)}
          onLaunchInLabEngine={handleLaunchInLabEngine}
        />
      )}
    </div>
  );
};
