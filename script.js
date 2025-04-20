document.addEventListener('DOMContentLoaded', function() {
  const pilotForm = document.getElementById('pilotForm');
  const pilotsContainer = document.getElementById('pilotsContainer');
  const pilotNameInput = document.getElementById('pilotName');
  const pilotRoleInput = document.getElementById('pilotRole');
  const pilotPromptInput = document.getElementById('pilotPrompt');
  
  // Load existing pilots from localStorage
  loadPilots();
  
  // Form submission handler
  pilotForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = pilotNameInput.value.trim();
    const role = pilotRoleInput.value.trim();
    const prompt = pilotPromptInput.value.trim();
    
    if (name && role && prompt) {
      addPilot(name, role, prompt);
      pilotForm.reset();
    }
  });
  
  // Add new pilot
  function addPilot(name, role, prompt) {
    const id = Date.now().toString();
    const pilot = {
      id: id,
      name: name,
      role: role,
      prompt: prompt
    };
    
    // Save to localStorage
    const pilots = getPilotsFromStorage();
    pilots.push(pilot);
    localStorage.setItem('nova_hub_pilots', JSON.stringify(pilots));
    
    // Add to UI
    createPilotElement(pilot);
  }
  
  // Create pilot UI element
  function createPilotElement(pilot) {
    if (document.querySelector('.empty-state')) {
      pilotsContainer.innerHTML = '';
    }
    
    const pilotElement = document.createElement('li');
    pilotElement.classList.add('pilot-card');
    pilotElement.dataset.id = pilot.id;
    
    pilotElement.innerHTML = `
      <div class="pilot-header">
        <h3>${pilot.name}</h3>
        <div class="pilot-actions">
          <button class="btn-edit">Edit</button>
          <button class="btn-delete">Delete</button>
        </div>
      </div>
      <div class="pilot-role">${pilot.role}</div>
      <div class="pilot-prompt">${pilot.prompt}</div>
    `;
    
    // Event listeners for edit and delete buttons
    const deleteBtn = pilotElement.querySelector('.btn-delete');
    deleteBtn.addEventListener('click', function() {
      deletePilot(pilot.id);
    });
    
    const editBtn = pilotElement.querySelector('.btn-edit');
    editBtn.addEventListener('click', function() {
      editPilot(pilot);
    });
    
    pilotsContainer.appendChild(pilotElement);
  }
  
  // Load pilots from localStorage
  function loadPilots() {
    const pilots = getPilotsFromStorage();
    
    if (pilots.length === 0) {
      pilotsContainer.innerHTML = '<div class="empty-state">No AI pilots created yet. Create your first one!</div>';
    } else {
      pilots.forEach(pilot => {
        createPilotElement(pilot);
      });
    }
  }
  
  // Delete pilot
  function deletePilot(id) {
    // Remove from storage
    let pilots = getPilotsFromStorage();
    pilots = pilots.filter(pilot => pilot.id !== id);
    localStorage.setItem('nova_hub_pilots', JSON.stringify(pilots));
    
    // Remove from UI
    const pilotElement = document.querySelector(`li[data-id="${id}"]`);
    if (pilotElement) {
      pilotElement.remove();
    }
    
    // Show empty state if no pilots left
    if (pilots.length === 0) {
      pilotsContainer.innerHTML = '<div class="empty-state">No AI pilots created yet. Create your first one!</div>';
    }
  }
  
  // Edit pilot
  function editPilot(pilot) {
    // Fill the form with pilot data
    pilotNameInput.value = pilot.name;
    pilotRoleInput.value = pilot.role;
    pilotPromptInput.value = pilot.prompt;
    
    // Delete the old pilot
    deletePilot(pilot.id);
    
    // Scroll to the form
    pilotForm.scrollIntoView({ behavior: 'smooth' });
  }
  
  // Get pilots from localStorage
  function getPilotsFromStorage() {
    const pilots = localStorage.getItem('nova_hub_pilots');
    return pilots ? JSON.parse(pilots) : [];
  }
});
