/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { DashboardPage } from './app/page';
import { ChatPage } from './app/chat/page';
import { LaboratoryPage } from './app/laboratory/page';
import { ExperimentsPage } from './app/experiments/page';
import { StandardsPage } from './app/standards/page';
import { ProductsPage } from './app/products/page';
import { CalculationsPage } from './app/calculations/page';
import { EquipmentPage } from './app/equipment/page';
import { SourcesPage } from './app/sources/page';
import { SettingsPage } from './app/settings/page';

export default function App() {
  return (
    <BrowserRouter>
      <AppLayout>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/laboratory" element={<LaboratoryPage />} />
          <Route path="/experiments" element={<ExperimentsPage />} />
          <Route path="/standards" element={<StandardsPage />} />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/calculations" element={<CalculationsPage />} />
          <Route path="/equipment" element={<EquipmentPage />} />
          <Route path="/sources" element={<SourcesPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          {/* Catch-all route redirecting back to dashboard */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppLayout>
    </BrowserRouter>
  );
}

