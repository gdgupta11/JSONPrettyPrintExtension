// Function to check if a string is valid JSON
function isValidJSON(str) {
    try {
      JSON.parse(str);
      return true;
    } catch (e) {
      return false;
    }
  }
  
  // Function to pretty-print JSON
  function prettyPrintJSON(jsonStr) {
    const parsed = JSON.parse(jsonStr);
    return JSON.stringify(parsed, null, 2);
  }
  
  // Scan DOM for potential JSON content in <pre> or <code> tags
  function scanForJSON() {
    const elements = document.querySelectorAll('pre, code');
    elements.forEach((el, index) => {
      const text = el.textContent.trim();
      if (isValidJSON(text)) {
        // Add a button before the element
        const button = document.createElement('button');
        button.textContent = 'Pretty Print JSON';
        button.style.marginBottom = '5px';
        button.id = `prettyPrintBtn-${index}`;
        el.parentNode.insertBefore(button, el);
  
        // Wrap the element in a container for styling
        const wrapper = document.createElement('div');
        wrapper.className = 'json-pretty-container';
        el.parentNode.insertBefore(wrapper, el);
        wrapper.appendChild(el);
  
        // Add click event to format JSON
        button.addEventListener('click', () => {
          el.textContent = prettyPrintJSON(text);
          button.style.display = 'none'; // Hide button after formatting
          // Optionally trigger syntax highlighting if using a library
          if (typeof hljs !== 'undefined') {
            hljs.highlightElement(el);
          }
        });
      }
    });
  }
  
  // Load Highlight.js from CDN for syntax highlighting
  const script = document.createElement('script');
  script.src = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js';
  script.onload = () => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/default.min.css';
    document.head.appendChild(link);
    scanForJSON();
  };
  document.head.appendChild(script);
  
  // Re-scan on dynamic content changes (optional)
  const observer = new MutationObserver(() => scanForJSON());
  observer.observe(document.body, { childList: true, subtree: true });