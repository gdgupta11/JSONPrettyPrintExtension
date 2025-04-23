// Function to check if a string is valid JSON
function isValidJSON(str) {
    try {
        // Handle empty or whitespace-only strings
        if (!str || str.trim() === '') return false;
        JSON.parse(str);
        return true;
    } catch (e) {
        return false;
    }
}

// Function to pretty-print JSON
function prettyPrintJSON(jsonStr) {
    try {
        const parsed = JSON.parse(jsonStr);
        return JSON.stringify(parsed, null, 2);
    } catch (e) {
        console.error('Error formatting JSON:', e);
        return jsonStr;
    }
}

// Function to create and add styles
function addStyles() {
    const style = document.createElement('style');
    style.textContent = `
        .json-pretty-container {
            background: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            margin: 10px 0;
        }
        .pretty-print-btn {
            background: #4285f4;
            color: white;
            border: none;
            padding: 5px 10px;
            border-radius: 4px;
            cursor: pointer;
            margin: 5px 0;
        }
        .pretty-print-btn:hover {
            background: #3367d6;
        }
    `;
    document.head.appendChild(style);
}

// Scan DOM for potential JSON content
function scanForJSON() {
    // Look for both pre/code tags and text nodes that might contain JSON
    const elements = [...document.querySelectorAll('pre, code, body > *')];
    
    elements.forEach((el, index) => {
        // Get text content, handling both element and text nodes
        let text = el.textContent || el.textContent;
        text = text.trim();

        if (isValidJSON(text)) {
            // Check if element is already processed
            if (el.getAttribute('data-json-processed')) return;
            el.setAttribute('data-json-processed', 'true');

            // Create container if needed
            let container = el.classList.contains('json-pretty-container') 
                ? el 
                : document.createElement('div');
            container.className = 'json-pretty-container';

            // Create button
            const button = document.createElement('button');
            button.textContent = 'Pretty Print JSON';
            button.className = 'pretty-print-btn';
            button.id = `prettyPrintBtn-${index}`;

            // Create pre element for formatted JSON
            const preElement = document.createElement('pre');
            preElement.textContent = text;

            // If the element isn't already in a container, wrap it
            if (container !== el) {
                el.parentNode.insertBefore(container, el);
                container.appendChild(button);
                container.appendChild(preElement);
                el.remove(); // Remove original element
            } else {
                container.insertBefore(button, container.firstChild);
            }

            // Add click event to format JSON
            button.addEventListener('click', () => {
                preElement.textContent = prettyPrintJSON(text);
                button.style.display = 'none';
            });

            // Optional: Auto-format if JSON is detected
            if (text.length < 1000) { // Only auto-format smaller JSON strings
                button.click();
            }
        }
    });
}

// Initialize
function init() {
    addStyles();
    scanForJSON();

    // Set up observer for dynamic content
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(mutation => {
            if (mutation.addedNodes.length) {
                scanForJSON();
            }
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Start the extension
document.addEventListener('DOMContentLoaded', init);
init(); // Run immediately in case DOM is already loaded