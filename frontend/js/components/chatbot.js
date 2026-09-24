// Professional Interactive AI Assistant Chatbot Component for StayNest

import { appState } from '../appState.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';
import { ACCOMMODATIONS } from '../mockData.js?v=81000_GENERIC_XYZ_GMAIL_PLACEHOLDERS';

export function renderChatbot() {
  if (document.getElementById('staynest-chatbot-wrapper')) return;

  const wrapper = document.createElement('div');
  wrapper.id = 'staynest-chatbot-wrapper';
  wrapper.style.cssText = 'position: fixed; bottom: 24px; right: 24px; z-index: 99990; font-family: "Inter", sans-serif;';

  wrapper.innerHTML = `
    <!-- Floating Trigger Button -->
    <button id="btn-chatbot-trigger" style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; border: none; padding: 0.85rem 1.4rem; border-radius: 999px; font-weight: 800; font-size: 0.92rem; cursor: pointer; display: flex; align-items: center; gap: 8px; box-shadow: 0 10px 25px rgba(99, 102, 241, 0.45); transition: transform 0.2s ease, box-shadow 0.2s ease;">
      <span style="font-size: 1.2rem;">🤖</span>
      <span>Ask AI</span>
      <span style="background: #10b981; width: 9px; height: 9px; border-radius: 50%; display: inline-block; box-shadow: 0 0 8px #10b981;"></span>
    </button>

    <!-- Chat Modal Window -->
    <div id="chatbot-window" style="display: none; position: absolute; bottom: 64px; right: 0; width: 390px; max-width: 92vw; height: 550px; max-height: 82vh; background: #ffffff; border-radius: 24px; box-shadow: 0 20px 50px rgba(15, 23, 42, 0.22); border: 1px solid #e2e8f0; flex-direction: column; overflow: hidden; animation: fadeIn 0.25s ease-out;">
      
      <!-- Header -->
      <div style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 100%); color: white; padding: 1.15rem 1.25rem; display: flex; justify-content: space-between; align-items: center;">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="background: rgba(255,255,255,0.15); width: 40px; height: 40px; border-radius: 12px; display: flex; align-items: center; justify-content: center; font-size: 1.3rem;">
            🤖
          </div>
          <div>
            <h4 style="font-size: 1.05rem; font-weight: 800; margin: 0 0 2px 0; letter-spacing: -0.2px;">StayNest AI Assistant</h4>
            <span style="font-size: 0.75rem; color: #a5b4fc; font-weight: 600; display: flex; align-items: center; gap: 4px;">
              <span style="width: 6px; height: 6px; background: #34d399; border-radius: 50%;"></span> Live AI Assistant
            </span>
          </div>
        </div>
        <button id="btn-chatbot-close" style="background: rgba(255,255,255,0.15); color: white; border: none; width: 32px; height: 32px; border-radius: 50%; cursor: pointer; font-weight: 800; display: flex; align-items: center; justify-content: center;">✕</button>
      </div>

      <!-- Quick Suggestion Chips -->
      <div style="background: #f8fafc; padding: 0.65rem 0.85rem; border-bottom: 1px solid #e2e8f0; display: flex; gap: 6px; overflow-x: auto; white-space: nowrap; scrollbar-width: none;">
        <button class="chat-chip" data-query="location" style="background: #eef2ff; color: #4338ca; border: 1px solid #c7d2fe; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          📍 Detect My Location
        </button>
        <button class="chat-chip" data-query="best pg in mumbai" style="background: #fdf4ff; color: #86198f; border: 1px solid #f5d0fe; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          🏙️ Best PG in Mumbai
        </button>
        <button class="chat-chip" data-query="Bopal" style="background: #fdf4ff; color: #86198f; border: 1px solid #f5d0fe; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          📍 Bopal PGs
        </button>
        <button class="chat-chip" data-query="under 8000" style="background: #f0fdf4; color: #166534; border: 1px solid #bbf7d0; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          💰 Under ₹8,000
        </button>
        <button class="chat-chip" data-query="girls" style="background: #fdf2f8; color: #9d174d; border: 1px solid #fbcfe8; padding: 4px 10px; border-radius: 999px; font-size: 0.78rem; font-weight: 700; cursor: pointer;">
          👧 Girls PG
        </button>
      </div>

      <!-- Chat Transcript Messages Area -->
      <div id="chat-messages" style="flex: 1; padding: 1rem; overflow-y: auto; display: flex; flex-direction: column; gap: 0.85rem; background: #fafafa;">
        <!-- Welcome Message -->
        <div style="display: flex; gap: 8px; align-items: flex-start;">
          <div style="background: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">🤖</div>
          <div style="background: white; border: 1px solid #e2e8f0; padding: 0.85rem 1rem; border-radius: 16px; border-top-left-radius: 4px; font-size: 0.88rem; color: #1e293b; max-width: 85%; box-shadow: 0 2px 6px rgba(0,0,0,0.03); line-height: 1.5;">
            Hi 👋 I'm <strong>StayNest Assistant</strong>. Search any city (e.g. <em>"best pg in mumbai"</em>), area (<em>Bopal, Andheri</em>), college, or budget, and I'll find 100% verified accommodations from our dataset!
          </div>
        </div>
      </div>

      <!-- Input Area -->
      <form id="chatbot-form" style="padding: 0.75rem 1rem; background: white; border-top: 1px solid #e2e8f0; display: flex; gap: 8px; align-items: center;">
        <input type="text" id="chatbot-input" autocomplete="off" placeholder="Type e.g. best pg in mumbai, Bopal, budget..." style="flex: 1; padding: 0.65rem 1rem; border-radius: 999px; border: 1px solid #cbd5e1; outline: none; font-size: 0.88rem;">
        <button type="submit" id="chatbot-send-btn" style="background: #6366f1; color: white; border: none; width: 38px; height: 38px; border-radius: 50%; cursor: pointer; display: flex; align-items: center; justify-content: center; flex-shrink: 0; box-shadow: 0 4px 10px rgba(99,102,241,0.3); font-size: 1.1rem;">
          ➔
        </button>
      </form>
    </div>
  `;

  document.body.appendChild(wrapper);

  const triggerBtn = wrapper.querySelector('#btn-chatbot-trigger');
  const chatWindow = wrapper.querySelector('#chatbot-window');
  const closeBtn = wrapper.querySelector('#btn-chatbot-close');
  const chatForm = wrapper.querySelector('#chatbot-form');
  const chatInput = wrapper.querySelector('#chatbot-input');
  const messagesArea = wrapper.querySelector('#chat-messages');

  let isOpened = false;

  function toggleWindow() {
    isOpened = !isOpened;
    chatWindow.style.display = isOpened ? 'flex' : 'none';
    if (isOpened) chatInput.focus();
  }

  triggerBtn.addEventListener('click', toggleWindow);
  closeBtn.addEventListener('click', toggleWindow);

  function appendUserMessage(text) {
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; justify-content: flex-end; margin-left: 2rem;';
    div.innerHTML = `
      <div style="background: linear-gradient(135deg, #6366f1 0%, #7c3aed 100%); color: white; padding: 0.75rem 1rem; border-radius: 16px; border-top-right-radius: 4px; font-size: 0.88rem; box-shadow: 0 2px 8px rgba(99,102,241,0.25); max-width: 85%;">
        ${text}
      </div>
    `;
    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  function appendBotResponse(htmlContent) {
    const div = document.createElement('div');
    div.style.cssText = 'display: flex; gap: 8px; align-items: flex-start;';
    div.innerHTML = `
      <div style="background: #6366f1; color: white; width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 0.85rem; flex-shrink: 0;">🤖</div>
      <div style="background: white; border: 1px solid #e2e8f0; padding: 0.85rem 1rem; border-radius: 16px; border-top-left-radius: 4px; font-size: 0.88rem; color: #1e293b; max-width: 85%; box-shadow: 0 2px 6px rgba(0,0,0,0.03); line-height: 1.5;">
        ${htmlContent}
      </div>
    `;
    messagesArea.appendChild(div);
    messagesArea.scrollTop = messagesArea.scrollHeight;
  }

  // Detect Math Calculations
  function isMathQuery(text) {
    const cleaned = text.replace(/^(what is|calculate|eval|compute|math|sum|val|value of)\s+/i, '').trim();
    return /^[\d\s\+\-\*\/\%\(\)\.]+$/.test(cleaned) && /[\+\-\*\/\%]/.test(cleaned);
  }

  // Off-topic or General Question Detector
  function checkOffTopicQuery(qText) {
    const q = qText.toLowerCase();

    if (isMathQuery(qText)) {
      return 'math_or_non_pg';
    }

    if (/^(hi|hello|hey|greetings|hola|good morning|good evening|good afternoon|namaste)$/i.test(q.trim())) {
      return 'greeting';
    }

    if (/^(who are you|what is staynest|what is this site|what do you do|help)$/i.test(q.trim())) {
      return 'about';
    }

    const domainKeywords = [
      'pg', 'hostel', 'room', 'stay', 'accommodation', 'flat', 'rent', 'deposit', 'boys', 'girls', 'co-ed', 'unisex',
      'single', 'double', 'triple', 'ac', 'wifi', 'food', 'mumbai', 'bengaluru', 'bangalore', 'delhi', 'pune', 'jaipur', 'ahmedabad',
      'bopal', 'navrangpura', 'vastrapur', 'satellite', 'thaltej', 'kothrud', 'viman nagar', 'andheri', 'bandra', 'powai',
      'under', 'below', 'budget', 'location', 'near', 'college', 'university', 'mess', 'best'
    ];

    const hasDomainKeyword = domainKeywords.some(kw => q.includes(kw));
    const hasAreaMatch = ACCOMMODATIONS.some(p => q.includes((p.area || '').toLowerCase()));

    if (!hasDomainKeyword && !hasAreaMatch && q.length < 40) {
      return 'general_offtopic';
    }
    return false;
  }

  function handleQuery(rawQuery) {
    if (!rawQuery || !rawQuery.trim()) return;
    const queryText = rawQuery.trim();
    appendUserMessage(queryText);

    // Check for Math or Non-PG Queries
    const offTopicType = checkOffTopicQuery(queryText);
    
    if (offTopicType === 'math_or_non_pg' || offTopicType === 'general_offtopic') {
      appendBotResponse(`
        🏡 <strong>StayNest AI Assistant</strong><br><br>
        StayNest is built specifically for <strong>searching & finding PGs and Hostels</strong>!<br><br>
        Please enter a city, area, college name, or budget to search for verified student and executive accommodations.<br><br>
        💡 <strong>Try searching:</strong><br>
        • <em>"Best PG in Mumbai"</em><br>
        • <em>"Girls PG in Navrangpura"</em><br>
        • <em>"Boys PG under ₹8,000"</em>
      `);
      return;
    }

    if (offTopicType === 'greeting') {
      appendBotResponse(`
        👋 Hello! I am the <strong>StayNest AI Assistant</strong>.<br>
        I can help you find 100% verified PGs, hostels, and coliving spaces across top cities.<br><br>
        💡 <strong>Try asking me:</strong><br>
        • <em>"Best PG in Mumbai"</em><br>
        • <em>"Girls PG under ₹8,000"</em><br>
        • <em>"Boys PG in Navrangpura"</em>
      `);
      return;
    }

    if (offTopicType === 'about') {
      appendBotResponse(`
        ℹ️ I am <strong>StayNest AI Assistant</strong>, designed specifically to help students and working professionals search for verified PGs & hostels.<br><br>
        For non-PG queries, please visit our <a href="#contact" style="color: #6366f1; font-weight: 700;">Support Page</a> or try searching for a city, area, or budget!
      `);
      return;
    }

    const q = queryText.toLowerCase();

    // 1. Location GPS Query
    if (q.includes('location') || q.includes('detect') || q.includes('near me')) {
      const currentCity = appState.getState().searchQuery.city || 'Ahmedabad';

      if (navigator.geolocation) {
        appendBotResponse('📡 Accessing device GPS location...');
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const lat = pos.coords.latitude;
            const lng = pos.coords.longitude;

            appState.updateSearchQuery({
              userLat: lat,
              userLng: lng,
              city: currentCity
            });

            const matches = ACCOMMODATIONS.filter(p => p.city.toLowerCase() === currentCity.toLowerCase()).slice(0, 3);
            let html = `📍 GPS Location detected: <strong>${lat.toFixed(4)}° N, ${lng.toFixed(4)}° E (${currentCity})</strong>.<br>Here are 3 verified PGs near you:`;
            html += renderMiniCards(matches);
            appendBotResponse(html);
          },
          () => {
            appState.updateSearchQuery({ city: currentCity, area: '', keyword: '' });
            const matches = ACCOMMODATIONS.filter(p => p.city.toLowerCase() === currentCity.toLowerCase()).slice(0, 3);
            let html = `📍 Location set to <strong>${currentCity}</strong>.<br>Here are 3 top-rated student accommodations:`;
            html += renderMiniCards(matches);
            appendBotResponse(html);
          },
          { enableHighAccuracy: true, timeout: 8000 }
        );
      } else {
        appState.updateSearchQuery({ city: currentCity, area: '', keyword: '' });
        const matches = ACCOMMODATIONS.filter(p => p.city.toLowerCase() === currentCity.toLowerCase()).slice(0, 3);
        let html = `📍 Location set to <strong>${currentCity}</strong>.<br>Here are 3 top-rated PGs near you:`;
        html += renderMiniCards(matches);
        appendBotResponse(html);
      }
      return;
    }

    // 2. Intelligent Natural Language City & Area Target Parsing
    const citiesList = [
      { name: 'Mumbai', keys: ['mumbai', 'bombay', 'bom'] },
      { name: 'Bengaluru', keys: ['bengaluru', 'bangalore', 'blr'] },
      { name: 'Delhi', keys: ['delhi', 'new delhi', 'ncr', 'del'] },
      { name: 'Pune', keys: ['pune', 'pn'] },
      { name: 'Jaipur', keys: ['jaipur', 'jpr'] },
      { name: 'Ahmedabad', keys: ['ahmedabad', 'ahmedbad', 'amd', 'ahd'] }
    ];

    let targetCity = '';
    
    for (const cityObj of citiesList) {
      for (const key of cityObj.keys) {
        const prepRegex = new RegExp(`(?:in|to|for|at|near)\\s+${key}\\b`, 'i');
        if (prepRegex.test(q)) {
          targetCity = cityObj.name;
          break;
        }
      }
      if (targetCity) break;
    }

    if (!targetCity) {
      for (const cityObj of citiesList) {
        for (const key of cityObj.keys) {
          if (q.includes(key)) {
            targetCity = cityObj.name;
            break;
          }
        }
        if (targetCity) break;
      }
    }

    // Area Parsing
    let matchedArea = '';
    const allAreas = Array.from(new Set(ACCOMMODATIONS.map(p => p.area).filter(Boolean)));
    for (const areaName of allAreas) {
      if (q.includes(areaName.toLowerCase())) {
        matchedArea = areaName;
        const matchingPg = ACCOMMODATIONS.find(p => (p.area || '').toLowerCase() === areaName.toLowerCase());
        if (matchingPg && !targetCity) targetCity = matchingPg.city;
        break;
      }
    }

    const finalCity = targetCity || appState.getState().searchQuery.city || 'Ahmedabad';

    // Budget Parsing
    let maxRent = 100000;
    const rentMatch = q.match(/(?:under|below|budget|upto|within)?\s*(?:₹|rs\.?)?\s*(\d{4,5})/i);
    if (rentMatch) {
      maxRent = parseInt(rentMatch[1]);
    } else if (q.includes('8000') || q.includes('8k')) {
      maxRent = 8000;
    } else if (q.includes('10000') || q.includes('10k')) {
      maxRent = 10000;
    } else if (q.includes('15000') || q.includes('15k')) {
      maxRent = 15000;
    }

    // Gender Filter
    let genderFilter = 'All';
    if (q.includes('girl') || q.includes('female') || q.includes('women')) genderFilter = 'Girls';
    if (q.includes('boy') || q.includes('male') || q.includes('men')) genderFilter = 'Boys';

    // Update global appState
    appState.updateSearchQuery({
      city: finalCity,
      area: matchedArea || '',
      keyword: ''
    });

    let candidatePgs = ACCOMMODATIONS.filter(p => p.city.toLowerCase() === finalCity.toLowerCase());
    if (candidatePgs.length === 0) candidatePgs = ACCOMMODATIONS;

    const scoredList = candidatePgs.map(p => {
      let score = 0;
      const pArea = (p.area || '').toLowerCase();
      const pName = (p.name || '').toLowerCase();
      const pCollege = (p.collegeName || '').toLowerCase();

      if (matchedArea && pArea === matchedArea.toLowerCase()) score += 50;
      if (pArea && q.includes(pArea)) score += 30;
      if (pName && q.includes(pName)) score += 20;

      const words = q.split(/\s+/);
      words.forEach(w => {
        if (w.length >= 3 && pArea.includes(w)) score += 15;
        if (w.length >= 3 && pName.includes(w)) score += 10;
        if (w.length >= 3 && pCollege.includes(w)) score += 12;
      });

      if (p.rent <= maxRent) score += 10;
      if (genderFilter !== 'All' && (p.gender === genderFilter || p.gender === 'Both Boys & Girls')) score += 10;

      score += (p.rating || 4.0);

      return { item: p, score: score };
    });

    let results = scoredList
      .sort((a, b) => b.score - a.score)
      .map(s => s.item)
      .slice(0, 3);

    const displayLocation = matchedArea ? `${matchedArea}, ${finalCity}` : finalCity;

    let html = `🏙️ Top 3 verified accommodations in <strong>${displayLocation}</strong> for <em>"${queryText}"</em>:`;
    html += renderMiniCards(results);
    appendBotResponse(html);
  }

  function renderMiniCards(pgList) {
    if (!pgList || pgList.length === 0) return '<p style="color: #64748b; margin-top: 6px;">No exact matches found in dataset.</p>';
    
    return `<div style="display: flex; flex-direction: column; gap: 8px; margin-top: 10px;">` +
      pgList.map(p => `
        <div style="background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 12px; padding: 10px; display: flex; gap: 10px; align-items: center;">
          <img src="${p.images ? p.images[0] : (p.image || 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?w=800')}" alt="${p.name}" style="width: 52px; height: 52px; border-radius: 8px; object-fit: cover;">
          <div style="flex: 1; min-width: 0;">
            <strong style="font-size: 0.85rem; color: #0f172a; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${p.name}</strong>
            <span style="font-size: 0.75rem; color: #64748b; display: block;">
              📍 ${p.area || 'Central'}, ${p.city} • ⭐ ${p.rating || 4.5}
            </span>
            <strong style="font-size: 0.82rem; color: #6366f1;">₹${(p.rent || 7500).toLocaleString()}/mo</strong>
          </div>
          <button class="chat-btn-view-pg" data-pgid="${p.id}" style="background: #6366f1; color: white; border: none; font-size: 0.72rem; font-weight: 800; padding: 6px 10px; border-radius: 999px; cursor: pointer; flex-shrink: 0;">
            View
          </button>
        </div>
      `).join('') +
    `</div>`;
  }

  messagesArea.addEventListener('click', (e) => {
    const btn = e.target.closest('.chat-btn-view-pg');
    if (btn) {
      const pgid = btn.getAttribute('data-pgid');
      if (pgid) {
        toggleWindow();
        appState.setPage('details', pgid);
      }
    }
  });

  wrapper.querySelectorAll('.chat-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const q = chip.getAttribute('data-query');
      handleQuery(q);
    });
  });

  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const txt = chatInput.value.trim();
    if (txt) {
      chatInput.value = '';
      handleQuery(txt);
    }
  });
}
