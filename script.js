// Initialize Firebase

const firebaseConfig = {
    apiKey: "AIzaSyDLYYqmWwA3H7V42ws54mSpvkX-BaDA0uI",
    authDomain: "contestsl-f2f85.firebaseapp.com",
    databaseURL: "https://contestsl-f2f85-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "contestsl-f2f85",
    storageBucket: "contestsl-f2f85.firebasestorage.app",
    messagingSenderId: "166587065822",
    appId: "1:166587065822:web:07ff99f02ce7e9002b694f",
    measurementId: "G-2DB662QQ5T"
};

firebase.initializeApp(firebaseConfig);
 
const database = firebase.database();
const submissionsRef = database.ref('contest-submissions');

// Form Submission Handler
document.getElementById('submission-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Validate GitHub URL
    const repoLink = document.getElementById('repo-link').value;
    if (!isValidGitHubUrl(repoLink)) {
        alert('Please provide a valid GitHub repository URL');
        return;
    }

    // Prepare submission data
    const submission = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        projectName: document.getElementById('project-name').value,
        repoLink: repoLink,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        timestamp: firebase.database.ServerValue.TIMESTAMP
    };

    // Save to Firebase
    const newSubmissionRef = submissionsRef.push();
    newSubmissionRef.set(submission)
        .then(() => {
            alert('Submission successful! Your project is now public.');
            e.target.reset();
            
            // Switch back to landing page
            document.getElementById('submission-page').style.display = 'none';
            document.getElementById('landing').style.display = 'block';
        })
        .catch((error) => {
            console.error('Submission error:', error);
            alert('Submission failed. Please try again.');
        });
});

// GitHub URL Validation
function isValidGitHubUrl(url) {
    const githubRegex = /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-]+\/?$/;
    return githubRegex.test(url);
}

// Load and Display Submitted Projects
function loadSubmittedProjects() {
    const projectsContainer = document.getElementById('submitted-projects-container');
    
    // Reference to the projects in Firebase
    const projectsRef = firebase.database().ref('contest-submissions');
    
    projectsRef.orderByChild('timestamp').once('value', 
        (snapshot) => {
            projectsContainer.innerHTML = ''; // Clear existing projects
            
            if (snapshot.numChildren() === 0) {
                projectsContainer.innerHTML = '<p>No projects submitted yet.</p>';
                return;
            }
            
            snapshot.forEach((childSnapshot) => {
                const submission = childSnapshot.val();
                
                const projectCard = document.createElement('div');
                projectCard.classList.add('project-card');
                projectCard.innerHTML = `
                    <div class="project-header">
                        <h3>${submission.projectName}</h3>
                        <span class="category-tag">${submission.category}</span>
                    </div>
                    <div class="project-details">
                        <p><strong>Submitted by:</strong> ${submission.name}</p>
                        <p>${submission.description}</p>
                        <a href="${submission.repoLink}" target="_blank" class="repo-link">View Repository</a>
                    </div>
                `;
                
                projectsContainer.prepend(projectCard);
            });
        },
        (error) => {
            console.error("Error loading projects:", error);
            projectsContainer.innerHTML = '<p>Error loading projects. Please try again later.</p>';
        }
    );
}

document.addEventListener('DOMContentLoaded', () => {
    const pages = {
        landing: document.getElementById('landing'),
        submission: document.getElementById('submission-page')
    };

    // Page Navigation Function
    function navigateTo(targetPage) {
        Object.values(pages).forEach(page => {
            page.style.display = 'none';
        });
        
        pages[targetPage].style.display = 'block';
    }

    // Modal Handling Function
    function toggleModal(modal, show = true) {
        modals[modal].style.display = show ? 'block' : 'none';
    }

    // Event Listeners
    document.getElementById('participate-btn').addEventListener('click', () => {
        navigateTo('submission');
    });

    // Add click event to platform logo to return to landing page
    const platformLogo = document.querySelector('.platform-logo');
    platformLogo.addEventListener('click', () => {
        navigateTo('landing');
    });

    const backButtons = document.querySelectorAll('.back-to-landing');
    backButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navigateTo('landing');
        });
    });

    // Initial page load
    navigateTo('landing');
});