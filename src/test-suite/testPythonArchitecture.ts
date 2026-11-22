import { FOOD_ENGINEERING_TEMPLATES } from '../lib/python/templates';
import { getAllSavedScripts, saveUserScript, deleteUserScript } from '../lib/python/scriptStorage';

export async function testPythonArchitecture() {
  console.log('--- TESTING PYTHON ARCHITECTURE ---');

  // 1. Verify Templates
  if (!FOOD_ENGINEERING_TEMPLATES || FOOD_ENGINEERING_TEMPLATES.length < 5) {
    throw new Error(`Expected at least 5 templates, found ${FOOD_ENGINEERING_TEMPLATES?.length}`);
  }
  console.log(`✓ Templates count verified: ${FOOD_ENGINEERING_TEMPLATES.length} templates.`);

  // Verify all templates have valid non-empty Python code
  for (const tmpl of FOOD_ENGINEERING_TEMPLATES) {
    if (!tmpl.id || !tmpl.title || !tmpl.code || tmpl.code.trim().length === 0) {
      throw new Error(`Template ${tmpl.id} has invalid code or metadata.`);
    }
    // Verify standard Python syntax features like def or import
    if (!tmpl.code.includes('def ') && !tmpl.code.includes('import ')) {
      throw new Error(`Template ${tmpl.id} does not appear to contain valid Python code.`);
    }
  }
  console.log('✓ All templates have valid Python structure and metadata.');

  // 2. Verify Storage & Presets
  const initialScripts = getAllSavedScripts();
  if (!initialScripts || initialScripts.length === 0) {
    throw new Error('getAllSavedScripts returned empty list.');
  }
  console.log(`✓ Initial saved scripts count: ${initialScripts.length}`);

  // Test save custom script
  const saved = saveUserScript({
    title: 'Test Script',
    category: 'تست',
    description: 'تست ذخیره‌سازی اسکریپت',
    code: 'print("Hello from Food Science Python")'
  });

  if (!saved.id || saved.title !== 'Test Script') {
    throw new Error('Failed to save user script.');
  }
  console.log(`✓ Custom script saved with id: ${saved.id}`);

  // Test cleanup
  deleteUserScript(saved.id);
  console.log('✓ Custom script cleaned up successfully.');

  console.log('ALL PYTHON ARCHITECTURE TESTS PASSED SUCCESSFULLY!');
  return true;
}

testPythonArchitecture()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Python architecture test failed:', err);
    process.exit(1);
  });
