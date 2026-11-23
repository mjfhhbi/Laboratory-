/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { DashboardPage } from './app/page';
import { ChatPage } from './app/chat/page';
import { LaboratoryPage } from './app/laboratory/page';
import { ExperimentsPage } from './app/experiments/page';
import { StandardsPage } from './app/standards/page';
import { IranianStandardsPage } from './app/standards/iran/page';
import { ProductsPage } from './app/products/page';
import { CalculationsPage } from './app/calculations/page';
import { MscAdvancedCalculationsPage } from './app/calculations/advanced/page';
import { ThermalCalculationsPage } from './app/calculations/thermal/page';
import { RheologyCalculationsPage } from './app/calculations/rheology/page';
import { IsothermCalculationsPage } from './app/calculations/isotherms/page';
import { FreezingCalculationsPage } from './app/calculations/freezing/page';
import { FormulationOptimizationPage } from './app/calculations/optimization/page';
import { PackagingCalculationsPage } from './app/calculations/packaging/page';
import { ScientificDataCenterPage } from './app/calculations/data-center/page';
import { EquipmentPage } from './app/equipment/page';
import { ReagentsPage } from './app/reagents/page';
import { LabTroubleshootingPage } from './app/troubleshooting/page';
import { MicrobiologyPage } from './app/microbiology/page';
import { FoodChemistryPage } from './app/food-chemistry/page';
import { QualityControlPage } from './app/quality-control/page';
import { FoodProductsPage } from './app/food-products/page';
import { SourcesPage } from './app/sources/page';
import ResearchPage from './app/research/page';
import { StatisticsPage } from './app/statistics/page';
import { PythonPage } from './app/python/page';
import { SettingsPage } from './app/settings/page';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <ErrorBoundary>
          <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/laboratory" element={<LaboratoryPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/standards/iran" element={<IranianStandardsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/calculations" element={<CalculationsPage />} />
          <Route path="/calculations/advanced" element={<MscAdvancedCalculationsPage />} />
          <Route path="/calculations/thermal" element={<ThermalCalculationsPage />} />
          <Route path="/calculations/rheology" element={<RheologyCalculationsPage />} />
          <Route path="/calculations/isotherms" element={<IsothermCalculationsPage />} />
          <Route path="/calculations/freezing" element={<FreezingCalculationsPage />} />
          <Route path="/calculations/optimization" element={<FormulationOptimizationPage />} />
          <Route path="/calculations/packaging" element={<PackagingCalculationsPage />} />
          <Route path="/calculations/data-center" element={<ScientificDataCenterPage />} />
          <Route path="/data-center" element={<ScientificDataCenterPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/reagents" element={<ReagentsPage />} />
          <Route path="/troubleshooting" element={<LabTroubleshootingPage />} />
          <Route path="/microbiology" element={<MicrobiologyPage />} />
          <Route path="/food-chemistry" element={<FoodChemistryPage />} />
          <Route path="/quality-control" element={<QualityControlPage />} />
          <Route path="/food-products" element={<FoodProductsPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/research" element={<ResearchPage />} />
          <Route path="/statistics" element={<StatisticsPage />} />
          <Route path="/python" element={<PythonPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch-all route redirecting back to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ErrorBoundary>
      </AppLayout>
    </BrowserRouter>
  );
}

