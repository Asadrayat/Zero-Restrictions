// // Remove existing scripts from https://app.vandra.ai
// document.querySelectorAll('script[src^="https://app.vandra.ai"]').forEach(script => {
//   script.remove();
// });

// // Observe for any new scripts added dynamically from https://app.vandra.ai
// const observer = new MutationObserver(mutations => {
//   mutations.forEach(mutation => {
//     mutation.addedNodes.forEach(node => {
//       // Check if the added node itself is a script tag from Vandra
//       if (
//         node.tagName === 'SCRIPT' &&
//         node.src &&
//         node.src.startsWith('https://app.vandra.ai')
//       ) {
//         node.parentNode.removeChild(node);
//         console.log('Removed dynamically added Vandra script:', node.src);
//       }

//       // If the added node is an element container, search inside it for such scripts
//       if (node.nodeType === 1) { // ELEMENT_NODE
//         const nestedScripts = node.querySelectorAll('script[src^="https://app.vandra.ai"]');
//         nestedScripts.forEach(script => {
//           script.parentNode.removeChild(script);
//           console.log('Removed nested Vandra script:', script.src);
//         });
//       }
//     });
//   });
// });

// // Start observing the entire document for additions to any subtree
// observer.observe(document.documentElement, { childList: true, subtree: true });


// Function to remove matching script elements
function removeMatchingScripts(srcPrefixList) {
  document.querySelectorAll('script').forEach(script => {
    srcPrefixList.forEach(prefix => {
      if (script.src && script.src.startsWith(prefix)) {
        script.remove();
        console.log('Removed static script:', script.src);
      }
    });
  });
}

// Remove initially loaded scripts
removeMatchingScripts([
  'https://app.vandra.ai',
  'https://cdn.attn.tv/zerores/dtag.js'
]);

// Observe for dynamically added scripts
const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    mutation.addedNodes.forEach(node => {
      if (node.tagName === 'SCRIPT' && node.src) {
        if (
          node.src.startsWith('https://app.vandra.ai') ||
          node.src.startsWith('https://cdn.attn.tv') ||
          node.src.includes('widget.js')
        ) {
          node.remove();
          console.log('Removed dynamically added script:', node.src);
        }
      }

      if (node.nodeType === 1) { // ELEMENT_NODE
        const nestedScripts = node.querySelectorAll('script');
        nestedScripts.forEach(script => {
          if (
            script.src &&
            (script.src.startsWith('https://app.vandra.ai') ||
             script.src.startsWith('https://cdn.attn.tv/zerores/dtag.js')) ||
             script.src.includes('widget.js')
          ) {
            script.remove();
            console.log('Removed nested script:', script.src);
          }
        });
      }
    });
  });
});

// Start observing for dynamic additions
observer.observe(document.documentElement, { childList: true, subtree: true });
