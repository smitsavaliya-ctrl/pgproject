// Unified City Landing Page Router Component

import { renderCityPage } from './city.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderSearchResultsPage() {
  const city = appState.getState().searchQuery.city || 'Ahmedabad';
  renderCityPage(city);
}
