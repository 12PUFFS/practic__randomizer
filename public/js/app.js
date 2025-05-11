document.addEventListener('DOMContentLoaded', () => {
  const participantsInput = document.getElementById('participantsInput');
  const addParticipantsBtn = document.getElementById('addParticipants');
  const clearParticipantsBtn = document.getElementById('clearParticipants');
  const participantsList = document.getElementById('participantsList');
  const winnersCount = document.getElementById('winnersCount');
  const drawWinnersBtn = document.getElementById('drawWinners');
  const winnersResult = document.getElementById('winnersResult');
  const refreshHistoryBtn = document.getElementById('refreshHistory');
  const winnersHistory = document.getElementById('winnersHistory');

  loadParticipants();
  loadWinnersHistory();

  addParticipantsBtn.addEventListener('click', addParticipants);
  clearParticipantsBtn.addEventListener('click', clearParticipants);
  drawWinnersBtn.addEventListener('click', drawWinners);
  refreshHistoryBtn.addEventListener('click', loadWinnersHistory);

  async function addParticipants() {
  const names = participantsInput.value
    .split('\n')
    .map(name => name.trim())
    .filter(name => name.length > 0);
  
  if (names.length === 0) {
    alert('Please enter at least one participant');
    return;
  }

  try {
    const response = await fetch('/api/participants', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ names })
    });

    if (!response.ok) throw new Error(await response.text());
    
    // После добавления загружаем полный обновлённый список
    await loadParticipants();
    participantsInput.value = '';
  } catch (error) {
    alert(`Error: ${error.message}`);
  }
}

  async function clearParticipants() {
  if (!confirm('Вы уверены, что хотите полностью очистить список участников и историю победителей?')) {
    return;
  }

  try {
    const response = await fetch('/api/participants', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 204) {
      displayParticipants([]);
      winnersResult.innerHTML = '<p>Список участников очищен</p>';
      winnersHistory.innerHTML = '<p>История победителей очищена</p>';
    } else {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Неизвестная ошибка');
    }
  } catch (error) {
    console.error('Ошибка:', error);
    alert(`Ошибка при очистке: ${error.message}`);
  }
}

  async function loadParticipants() {
    try {
      const response = await fetch('/api/participants');
      if (!response.ok) {
        throw new Error('Failed to load participants');
      }
      const participants = await response.json();
      displayParticipants(participants);
    } catch (error) {
      console.error('Error loading participants:', error);
    }
  }

  function displayParticipants(participants) {
  if (participants.length === 0) {
    participantsList.innerHTML = '<p>No participants added yet</p>';
    return;
  }

  const html = `
    <ul>
      ${participants.map(p => `<li>${p.name}</li>`).join('')}
    </ul>
  `;
  participantsList.innerHTML = html;
}

  async function drawWinners() {
    const count = parseInt(winnersCount.value);
    if (isNaN(count) || count < 1) {
      alert('Please enter a valid number of winners');
      return;
    }

    try {
      const response = await fetch('/api/winners/draw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      const winners = await response.json();
      displayWinners(winners);
      loadWinnersHistory(); // РЕФРЕШНУТЬ ИСТОРИЮ const refreshHistoryBtn displayWinnersHistory
    } catch (error) {
      alert(`Error: ${error.message}`);
    }
  }

  function displayWinners(winners) {
    if (winners.length === 0) {
      winnersResult.innerHTML = '<p>No winners drawn</p>';
      return;
    }

    const html = `
      <h3>${winners.length > 1 ? 'Winners' : 'Winner'}</h3>
      <ul class="winners">
        ${winners.map(winner => `
          <li>
            <span class="winner-name">${winner.name}</span>
            <span class="winner-date">${new Date(winner.draw_date).toLocaleString()}</span>
          </li>
        `).join('')}
      </ul>
    `;
    winnersResult.innerHTML = html;
  }

  async function loadWinnersHistory() {
  try {
    const response = await fetch('/api/winners/history');
    if (!response.ok) {
      throw new Error('Failed to load winners history');
    }
    const history = await response.json();
    displayWinnersHistory(history);
  } catch (error) {
    console.error('Error loading winners history:', error);
    winnersHistory.innerHTML = '<p class="error">Error loading history</p>';
  }
}

  function displayWinnersHistory(history) {
  if (!history || history.length === 0) {
    winnersHistory.innerHTML = '<p>No winners yet</p>';
    return;
  }
// почему когда ты нажимаешь на пноку Add Participants участник добавляется а все остальные стираются. но остаются в выборке 
  const html = `
    <table class="history-table">
      <thead>
        <tr>
          <th>Name</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        ${history.map(winner => `
          <tr>
            <td>${winner.name}</td>
            <td>${new Date(winner.draw_date).toLocaleString()}</td>
          </tr>
        `).join('')}
      </tbody>
    </table>
  `;
  winnersHistory.innerHTML = html;
}
});